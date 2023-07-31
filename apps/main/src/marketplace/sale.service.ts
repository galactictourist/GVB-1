import { BadRequestException, Injectable } from '@nestjs/common';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { DateTime } from 'luxon';
import { FindManyOptions, FindOptionsWhere, In } from 'typeorm';
import { randomUnit256 } from '~/main/lib';
import { NftService } from '~/main/nft/nft.service';
import {
  BlockchainNetwork,
  CryptoCurrency,
  getMarketplaceSmartContract,
  isCryptoCurrencyEnabled,
} from '~/main/types/blockchain';
import { ContextUser } from '~/main/types/user-request';
import { MarketSmartContractService } from '../blockchain/market-smart-contracts.service';
import { NftSmartContractService } from '../blockchain/nft-smart-contracts.service';
import { SignerService } from '../blockchain/signer.service';
import { SaleContractData, TypedData } from '../blockchain/types';
import { SaleCancelledEvent } from '../blockchain/types/event';
import { CharityService } from '../charity/charity.service';
import { NftStatus } from '../nft/types';
import { UserService } from '../user/user.service';
import { CheckSaleDto } from './dto/check-sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { FilterSaleParam } from './dto/filter-sale.param';
import { ListNftsDto } from './dto/list-nft.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import { SigningSaleDto } from './dto/signing-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleRepository } from './repository/sale.repository';
import { CheckSale, SaleStatus } from './types';
import { RawSigningData, SaleData, SigningData } from './types/sale-data';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly nftService: NftService,
    private readonly signerService: SignerService,
    private readonly charityService: CharityService,
    private readonly userService: UserService,
    private readonly marketSmartContractService: MarketSmartContractService,
    private readonly nftMarketplaceContractService: NftSmartContractService,
  ) {}

  async search(
    searchSaleDto: SearchSaleDto,
    defaults: FindOptionsWhere<SaleEntity> = {},
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
    const { saleEntity, artistAddress } = await this._createSaleEntity(
      signingSaleDto,
      user,
    );
    const saleData = this.saleRepository.generateSaleData(saleEntity);
    const signingData = this.saleRepository.generateTypedData(
      saleEntity,
      saleData.salt,
      artistAddress,
    );
    const rawSigningData: RawSigningData = {
      saleData,
      signingData,
    };

    return this.convertSigningData(rawSigningData);
  }

  private async convertSigningData(raw: RawSigningData): Promise<SigningData> {
    const saleDataString = JSON.stringify(raw.saleData);
    const signingDataString = JSON.stringify(raw.signingData);
    const serverSignature = await this.signerService.signByVerifier(
      saleDataString,
    );

    return {
      signingData: signingDataString,
      saleData: saleDataString,
      serverSignature,
    };
  }

  async listNftsByAdmin(listNftsDto: ListNftsDto) {
    const ADMIN_SELLR_ADDRESS = String(process.env.ADMIN_SELLR_ADDRESS);
    const owner = await this.userService.findUserByWallet(ADMIN_SELLR_ADDRESS);
    if (!owner) {
      throw new BadRequestException('Invalid owner');
    }
    const nfts = await this.nftService.findNfts(
      listNftsDto.collectionId,
      listNftsDto.nftTokenId,
      listNftsDto.listNftQuantity,
      owner.id,
    );
    if (!nfts) {
      throw new BadRequestException('Cannot find nfts');
    }
    const charity = await this.charityService.getCharity(listNftsDto.charityId);
    if (!charity) {
      throw new BadRequestException('Charity is invalid');
    }
    const charityTopic = await this.charityService.getCharityTopic(
      listNftsDto.charityId,
    );
    if (!charityTopic) {
      throw new BadRequestException('Charity and topic are not matched');
    }
    if (!charityTopic.wallet) {
      throw new BadRequestException('Charity wallet is invalid');
    }

    const isApprovedForAll =
      await this.nftMarketplaceContractService.isApprovedForAll(
        listNftsDto.network,
        String(nfts[0].scAddress),
        ADMIN_SELLR_ADDRESS,
        getMarketplaceSmartContract(listNftsDto.network).address,
      );
    if (!isApprovedForAll) {
      await this.nftMarketplaceContractService.setApprovalForAllByAdmin(
        listNftsDto.network,
        String(nfts[0].scAddress),
        getMarketplaceSmartContract(listNftsDto.network).address,
      );
    }
    for (const nft of nfts) {
      const countExistingSale = await this.count(
        {
          userIds: [String(nft.owner?.id)],
          nftIds: [String(nft.id)],
          statuses: [SaleStatus.LISTING],
        },
        { take: 1 },
      );
      if (countExistingSale > 0) {
        console.log(`nftId=${nft.id} is on sale`);
        continue;
      }
      const expiredAt = DateTime.now()
        .plus({
          minutes: listNftsDto.expiryInMinutes,
        })
        .toJSDate();

      // create sale entity from sale data
      const sale = this.saleRepository.create({
        user: nft.owner,
        nft: nft,
        network: listNftsDto.network || BlockchainNetwork.POLYGON_MUMBAI,
        price: String(listNftsDto.price),
        currency: CryptoCurrency.NATIVE_CURRENCY,
        charityShare: listNftsDto.charityShare,
        charityWallet: charityTopic.wallet,
        topicId: charityTopic.topicId,
        charityId: listNftsDto.charityId,
        quantity: 1,
        expiredAt: expiredAt,
      });
      const salt = randomUnit256();
      const signData = this.saleRepository.generateTypedData(
        sale,
        salt,
        String(nft.collection?.artistAddress),
      );
      const sellerSignature = await this.signerService.signBySeller(signData);

      sale.signature = sellerSignature;
      sale.status = SaleStatus.LISTING;
      sale.signedData = signData;
      sale.hash = _TypedDataEncoder
        .from(signData.types)
        .hash(signData.message)
        .toLowerCase();

      // verify clientSignature with signedData
      if (
        !this.signerService.verifyTypedData(
          signData,
          sellerSignature,
          ADMIN_SELLR_ADDRESS,
        )
      ) {
        throw new BadRequestException('Invalid seller signature');
      }

      // save sale entity
      await sale.save();
    }
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
      relations: { owner: true, collection: true },
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
      // countryCode: saleData.countryCode,
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
      this.saleRepository.generateTypedData(
        sale,
        saleData.salt,
        String(nft.collection?.artistAddress),
      );
    sale.signedData = signedData;
    sale.hash = _TypedDataEncoder
      .from(signedData.types)
      .hash(signedData.message)
      .toLowerCase();

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
      relations: { owner: true, collection: true },
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
    const charity = await this.charityService.getCharity(
      signingSaleDto.charityId,
    );
    if (!charity) {
      throw new BadRequestException('Charity is invalid');
    }
    if (!charity.isActive()) {
      throw new BadRequestException('Charity is not active');
    }
    // validate charity and country and topic
    const charityTopic = await this.charityService.getCharityTopic(
      signingSaleDto.charityId,
      // signingSaleDto.topicId,
      // signingSaleDto.countryCode,
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
      topicId: charityTopic.topicId,
      charityId: signingSaleDto.charityId,
      quantity: signingSaleDto.quantity,
      remainingQuantity: signingSaleDto.quantity,
      expiredAt,
    });

    return {
      saleEntity,
      artistAddress: String(nft.collection?.artistAddress),
    };
  }

  async processCancelledSales(
    network: BlockchainNetwork,
    fromBlock: number,
    toBlock: number,
  ) {
    console.log('processCancelledSales');
    const events = await this.marketSmartContractService.getSaleCancelledEvents(
      network,
      fromBlock,
      toBlock,
    );
    const result = await Promise.allSettled(
      events.map((event) => {
        return this.cancelSalesByHashes(network, event);
      }),
    );

    return result;
  }

  // async cancelSaleByHash(
  //   network: BlockchainNetwork,
  //   hash: string,
  // ): Promise<SaleEntity | undefined> {
  //   hash = hash.toLowerCase();
  //   const saleEntity = await this.saleRepository.findOneBy({
  //     network,
  //     hash,
  //   });

  //   if (!saleEntity) {
  //     return;
  //   }
  //   if (saleEntity.status === SaleStatus.CANCELLED) {
  //     return saleEntity;
  //   }
  //   if (!saleEntity.isListing()) {
  //     throw new BadRequestException('Sale is invalid');
  //   }

  //   return this._cancelSale(saleEntity);
  // }

  async cancelSalesByHashes(
    network: BlockchainNetwork,
    event: SaleCancelledEvent,
  ): Promise<PromiseSettledResult<SaleEntity | undefined>[]> {
    const result = await Promise.allSettled(
      event.ordersHash.map(async (hash) => {
        try {
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
        } catch (e: unknown) {
          console.error('Error on cancelling sale', hash, e);
          throw e;
        }
      }),
    );
    return result;
  }

  private async _cancelSale(saleEntity: SaleEntity): Promise<SaleEntity> {
    saleEntity.status = SaleStatus.CANCELLED;
    await this.saleRepository.save(saleEntity);

    return saleEntity;
  }

  async checkSaleStatus(userId: string, checkSaleDto: CheckSaleDto) {
    if (checkSaleDto.actionStatus == CheckSale.UNLIST) {
      const saleEntity = await this.saleRepository.findOne({
        where: {
          userId: userId,
          nftId: checkSaleDto.nftId,
          status: SaleStatus.CANCELLED,
        },
      });
      if (saleEntity) {
        return true;
      }
    } else if (checkSaleDto.actionStatus == CheckSale.BUY) {
      const saleEntity = await this.saleRepository.findOne({
        where: {
          nftId: checkSaleDto.nftId,
          status: SaleStatus.FULFILLED,
          nft: {
            status: NftStatus.ACTIVE,
            isMinted: true,
            ownerId: userId,
          },
        },
        relations: {
          nft: true,
        },
      });

      if (saleEntity) {
        return true;
      }
    }
    return false;
  }
}
