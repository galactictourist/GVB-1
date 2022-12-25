import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { FindManyOptions, FindOptionsWhere, In } from 'typeorm';
import { NftService } from '~/main/nft/nft.service';
import { NftStatus } from '~/main/nft/types';
import {
  BlockchainNetwork,
  isCryptoCurrencyEnabled,
} from '~/main/types/blockchain';
import { ContextUser } from '~/main/types/user-request';
import { MarketSmartContractService } from '../blockchain/market-smart-contracts.service';
import { SignerService } from '../blockchain/signer.service';
import { CharityService } from '../charity/charity.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { FilterSaleParam } from './dto/filter-sale.param';
import { SearchSaleDto } from './dto/search-sale.dto';
import { SigningSaleDto } from './dto/signing-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleRepository } from './repository/sale.repository';
import { SaleStatus } from './types';
import { SaleData, SigningData } from './types/sale-data';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly nftService: NftService,
    private readonly signerService: SignerService,
    private readonly charityService: CharityService,
    private readonly marketSmartContractService: MarketSmartContractService,
  ) {}

  async search(
    searchSaleDto: SearchSaleDto,
    defaults: FindOptionsWhere<SaleEntity>,
  ) {
    const where: FindOptionsWhere<SaleEntity> = {};
    if (searchSaleDto.filter?.userIds && searchSaleDto.filter.userIds.length) {
      where.userId = In(searchSaleDto.filter.userIds);
    }
    if (searchSaleDto.filter?.nftIds && searchSaleDto.filter.nftIds.length) {
      where.nftId = In(searchSaleDto.filter.nftIds);
    }
    if (
      searchSaleDto.filter?.charityIds &&
      searchSaleDto.filter.charityIds.length
    ) {
      where.charityId = In(searchSaleDto.filter.charityIds);
    }
    if (
      searchSaleDto.filter?.countryCodes &&
      searchSaleDto.filter.countryCodes.length
    ) {
      where.countryCode = In(searchSaleDto.filter.countryCodes);
    }
    if (
      searchSaleDto.filter?.networks &&
      searchSaleDto.filter.networks.length
    ) {
      where.network = In(searchSaleDto.filter.networks);
    }

    const result = await this.saleRepository.simplePaginate(
      {
        ...where,
        ...defaults,
      },
      searchSaleDto.pagination,
    );
    return result;
  }

  private _generateFindOptions(filterParam: FilterSaleParam = {}) {
    const where: FindOptionsWhere<SaleEntity> = {};
    if (filterParam.ids && filterParam.ids.length) {
      where.id = In(filterParam.ids);
    }
    if (filterParam?.userIds && filterParam.userIds.length) {
      where.userId = In(filterParam.userIds);
    }
    if (filterParam?.nftIds && filterParam.nftIds.length) {
      where.nftId = In(filterParam.nftIds);
    }
    if (filterParam?.statuses && filterParam.statuses.length) {
      where.status = In(filterParam.statuses);
    }
    if (filterParam?.networks && filterParam.networks.length) {
      where.network = In(filterParam.networks);
    }

    return where;
  }

  async query(
    filterParam: FilterSaleParam,
    defaults: FindManyOptions<SaleEntity> = {},
  ) {
    const where = this._generateFindOptions(filterParam);

    return this.saleRepository.findAndCount({ ...defaults, where });
  }

  async count(
    filterParam: FilterSaleParam,
    defaults: FindManyOptions<SaleEntity> = {},
  ) {
    const where = this._generateFindOptions(filterParam);

    return this.saleRepository.count({
      ...defaults,
      where,
    });
  }

  async generateSigningData(
    signingSaleDto: SigningSaleDto,
    user: ContextUser,
  ): Promise<SigningData> {
    const saleEntity = await this._createSaleEntity(signingSaleDto, user);

    const saleData = this.saleRepository.generateSaleData(saleEntity);
    const saleDataString = JSON.stringify(saleData);
    const serverSignature = await this.signerService.sign(saleDataString);
    const signingData = JSON.stringify(
      this.saleRepository.generateTypedData(saleEntity),
    );

    return { signingData, saleData: saleDataString, serverSignature };
  }

  async createSale(
    createSaleDto: CreateSaleDto,
    user: ContextUser,
  ): Promise<SaleEntity> {
    if (!user.wallet) {
      throw new BadRequestException('Invalid user wallet');
    }
    if (
      !this.signerService.isSignedByVerifier(
        createSaleDto.saleData,
        createSaleDto.serverSignature,
      )
    ) {
      throw new BadRequestException('Invalid sale data');
    }

    const saleData: SaleData = JSON.parse(createSaleDto.saleData);
    if (saleData.userId !== user.id) {
      throw new BadRequestException('Invalid sale data');
    }
    // TODO validate saleData once again - optional

    // create sale entity from sale data
    const sale = this.saleRepository.create({
      userId: saleData.userId,
      nftId: saleData.nftId,
      network: saleData.network,
      price: saleData.price,
      currency: saleData.currency,
      countryCode: saleData.countryCode,
      charityShare: saleData.charityShare,
      charityWallet: saleData.charityWallet,
      topicId: saleData.topicId,
      charityId: saleData.charityId,
      expiredAt: DateTime.fromSeconds(saleData.expiredAt),
      status: SaleStatus.LISTING,
    });

    // generate signedData
    const signedData = this.saleRepository.generateTypedData(sale);
    sale.signedData = signedData;

    // verify clientSignature with signedData
    if (
      this.signerService.verifyTypedData(
        signedData,
        createSaleDto.clientSignature,
        user.wallet,
      )
    ) {
      throw new BadRequestException('Invalid client signature');
    }

    // save sale entity
    await sale.save();

    return sale;
  }

  private async _createSaleEntity(
    signingSaleDto: SigningSaleDto,
    user: ContextUser,
  ) {
    if (!user.wallet) {
      throw new BadRequestException('Invalid user wallet');
    }
    // validate network and currency
    if (
      !isCryptoCurrencyEnabled(signingSaleDto.network, signingSaleDto.currency)
    ) {
      throw new BadRequestException('Currency is not supported');
    }
    // validate charity and country and topic
    const charityTopic = await this.charityService.getCharityTopic(
      signingSaleDto.charityId,
      signingSaleDto.topicId,
      signingSaleDto.countryCode,
    );
    if (!charityTopic) {
      throw new BadRequestException('Charity and topic are not matched');
    }

    // count existing active sale
    const countExistingSale = await this.count(
      {
        userIds: [user.id],
        nftIds: [signingSaleDto.nftId],
        networks: [signingSaleDto.network],
        statuses: [SaleStatus.LISTING],
      },
      { take: 1 },
    );
    if (countExistingSale > 0) {
      throw new BadRequestException('NFT is on sale');
    }

    // checking NFT
    const count = await this.nftService.count(
      {
        ids: [signingSaleDto.nftId],
        ownerIds: [user.id],
        networks: [signingSaleDto.network],
        statuses: [NftStatus.ACTIVE],
      },
      { take: 1 },
    );
    if (count !== 1) {
      throw new BadRequestException('NFT is invalid');
    }

    const expiredAt = DateTime.now().plus({
      minutes: signingSaleDto.expiryInMinutes,
    });
    const saleEntity = this.saleRepository.create({
      userId: user.id,
      nftId: signingSaleDto.nftId,
      network: signingSaleDto.network,
      price: signingSaleDto.price.toString(),
      currency: signingSaleDto.currency,
      countryCode: signingSaleDto.countryCode,
      charityShare: signingSaleDto.charityShare,
      charityWallet: charityTopic.wallet,
      topicId: signingSaleDto.topicId,
      charityId: signingSaleDto.charityId,
      expiredAt,
    });

    saleEntity.signedData = this.saleRepository.generateTypedData(saleEntity);
    return saleEntity;
  }

  async processCancelledSales(
    network: BlockchainNetwork,
    fromBlock: number,
    toBlock: number,
  ) {
    const events = await this.marketSmartContractService.getSaleCancelledEvents(
      network,
      fromBlock,
      toBlock,
    );

    const result = await Promise.allSettled(
      events.map((event) => {
        return this.cancelSaleByHash(network, event.hash);
      }),
    );

    return result;
  }

  async cancelSaleByHash(
    network: BlockchainNetwork,
    hash: string,
  ): Promise<SaleEntity | undefined> {
    hash = hash.toLowerCase();
    const saleEntity = await this.saleRepository.findOneBy({
      network,
      hash,
    });

    if (!saleEntity) {
      return;
    }
    if (saleEntity.status === SaleStatus.CANCELLED) {
      return saleEntity;
    }
    if (!saleEntity.isListing()) {
      throw new BadRequestException('Sale is invalid');
    }

    return this._cancelSale(saleEntity);
  }

  private async _cancelSale(saleEntity: SaleEntity): Promise<SaleEntity> {
    saleEntity.status = SaleStatus.CANCELLED;
    await this.saleRepository.save(saleEntity);

    return saleEntity;
  }
}
