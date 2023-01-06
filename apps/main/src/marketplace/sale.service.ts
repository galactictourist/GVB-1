import { BadRequestException, Injectable } from '@nestjs/common';
import { utils } from 'ethers';
import { DateTime } from 'luxon';
import { FindManyOptions, FindOptionsWhere, In } from 'typeorm';
import { NftService } from '~/main/nft/nft.service';
import {
  BlockchainNetwork,
  isCryptoCurrencyEnabled,
} from '~/main/types/blockchain';
import { ContextUser } from '~/main/types/user-request';
import { MarketSmartContractService } from '../blockchain/market-smart-contracts.service';
import { SignerService } from '../blockchain/signer.service';
import { SaleContractData, TypedData } from '../blockchain/types';
import { CharityService } from '../charity/charity.service';
import { UserService } from '../user/user.service';
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
    private readonly userService: UserService,
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
    const serverSignature = await this.signerService.signByVerifier(
      saleDataString,
    );
    const signingData = JSON.stringify(
      this.saleRepository.generateTypedData(saleEntity, saleData.salt),
    );

    return { signingData, saleData: saleDataString, serverSignature };
  }

  async createSale(
    createSaleDto: CreateSaleDto,
    contextUser: ContextUser,
  ): Promise<SaleEntity> {
    if (
      !this.signerService.isSignedByVerifier(
        createSaleDto.saleData,
        createSaleDto.serverSignature,
      )
    ) {
      throw new BadRequestException('Invalid sale data');
    }

    const saleData: SaleData = JSON.parse(createSaleDto.saleData);
    // TODO validate saleData once again - optional
    if (saleData.userId !== contextUser.id) {
      throw new BadRequestException('Invalid sale data');
    }
    const nft = await this.nftService.findById(saleData.nftId, {
      relations: { owner: true },
    });
    if (!nft) {
      throw new BadRequestException('NFT is not found');
    }
    if (!nft.owner) {
      throw new BadRequestException('Owner is not found');
    }
    if (!nft.owner.wallet) {
      throw new BadRequestException('Invalid user wallet');
    }

    // create sale entity from sale data
    const sale = this.saleRepository.create({
      user: nft.owner,
      nft: nft,
      network: saleData.network,
      price: saleData.price,
      currency: saleData.currency,
      countryCode: saleData.countryCode,
      charityShare: saleData.charityShare,
      charityWallet: saleData.charityWallet,
      topicId: saleData.topicId,
      charityId: saleData.charityId,
      quantity: saleData.quantity,
      expiredAt: DateTime.fromSeconds(saleData.expiredAt).toJSDate(),
      signature: createSaleDto.clientSignature,
      status: SaleStatus.LISTING,
    });

    // generate signedData
    const signedData: TypedData<SaleContractData> =
      this.saleRepository.generateTypedData(sale, saleData.salt);
    sale.signedData = signedData;
    sale.hash = this.hashSaleContractData(signedData.message);

    // verify clientSignature with signedData
    if (
      !this.signerService.verifyTypedData(
        signedData,
        createSaleDto.clientSignature,
        nft.owner.wallet,
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
    contextUser: ContextUser,
  ) {
    // checking NFT
    const nft = await this.nftService.findById(signingSaleDto.nftId, {
      relations: { owner: true },
    });
    if (!nft) {
      throw new BadRequestException('NFT is invalid');
    }
    if (nft.ownerId !== contextUser.id) {
      throw new BadRequestException('Owner mismatch');
    }
    if (nft.network !== signingSaleDto.network) {
      throw new BadRequestException('Network mismatch');
    }
    if (!nft.isActive()) {
      throw new BadRequestException('NFT is not active');
    }

    if (!nft.owner) {
      throw new BadRequestException('Invalid user');
    }
    if (!nft.owner.isActive()) {
      throw new BadRequestException('User is not active');
    }
    if (!nft.owner.wallet) {
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
    if (!charityTopic.wallet) {
      throw new BadRequestException('Charity wallet is invalid');
    }

    // count existing active sale
    const countExistingSale = await this.count(
      {
        userIds: [nft.owner.id],
        nftIds: [signingSaleDto.nftId],
        networks: [signingSaleDto.network],
        statuses: [SaleStatus.LISTING],
      },
      { take: 1 },
    );
    if (countExistingSale > 0) {
      throw new BadRequestException('NFT is on sale');
    }

    const expiredAt = DateTime.now()
      .plus({
        minutes: signingSaleDto.expiryInMinutes,
      })
      .toJSDate();
    const saleEntity = this.saleRepository.create({
      userId: nft.owner.id,
      user: nft.owner,
      nftId: signingSaleDto.nftId,
      nft,
      network: signingSaleDto.network,
      price: signingSaleDto.price.toString(),
      currency: signingSaleDto.currency,
      countryCode: signingSaleDto.countryCode,
      charityShare: signingSaleDto.charityShare,
      charityWallet: charityTopic.wallet,
      topicId: signingSaleDto.topicId,
      charityId: signingSaleDto.charityId,
      quantity: signingSaleDto.quantity,
      remainingQuantity: signingSaleDto.quantity,
      expiredAt,
    });

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

  private hashSaleContractData(item: SaleContractData) {
    const ORDER_ITEM_TYPEHASH = utils.keccak256(
      utils.toUtf8Bytes(
        'OrderItem(address nftContract,address seller,bool isMinted,uint256 tokenId,string tokenURI, uint256 quantity,uint256 itemPrice,address charityAddress,uint96 charityShare,uint96 royaltyFee,uint256 deadline,uint256 salt)',
      ),
    );
    const hash = utils.keccak256(
      utils.defaultAbiCoder.encode(
        [
          'bytes32',
          'address',
          'address',
          'bool',
          'uint256',
          'bytes32',
          'uint256',
          'uint256',
          'address',
          'uint96',
          'uint96',
          'uint256',
          'uint256',
        ],
        [
          ORDER_ITEM_TYPEHASH,
          item.nftContract,
          item.seller,
          item.isMinted,
          item.tokenId,
          utils.keccak256(utils.toUtf8Bytes(item.tokenURI)),
          item.quantity,
          item.itemPrice,
          item.charityAddress,
          item.charityShare,
          item.royaltyFee,
          item.deadline,
          item.salt,
        ],
      ),
    );

    return hash;
  }
}
