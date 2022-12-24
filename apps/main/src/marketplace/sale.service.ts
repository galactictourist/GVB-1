import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DeepPartial, FindManyOptions, FindOptionsWhere, In } from 'typeorm';
import { NftService } from '~/main/nft/nft.service';
import { NftStatus } from '~/main/nft/types';
import {
  BlockchainNetwork,
  isCryptoCurrencyEnabled,
} from '~/main/types/blockchain';
import { ContextUser } from '~/main/types/user-request';
import { MarketSmartContractService } from '../blockchain/market-smart-contracts.service';
import { CharityService } from '../charity/charity.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { FilterSaleParam } from './dto/filter-sale.param';
import { SearchSaleDto } from './dto/search-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleRepository } from './repository/sale.repository';
import { SaleStatus } from './types';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly nftService: NftService,
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

  async createSale(
    createSaleDto: CreateSaleDto,
    defaults: DeepPartial<SaleEntity>,
    user: ContextUser,
  ) {
    // validate network and currency
    if (
      !isCryptoCurrencyEnabled(createSaleDto.network, createSaleDto.currency)
    ) {
      throw new BadRequestException('Currency is not supported');
    }
    // validate charity and country and topic
    const charityTopic = await this.charityService.getCharityTopic(
      createSaleDto.charityId,
      createSaleDto.topicId,
      createSaleDto.countryCode,
    );
    if (!charityTopic) {
      throw new BadRequestException('Charity and topic are not matched');
    }

    // count existing active sale
    const countExistingSale = await this.count(
      {
        userIds: [user.id],
        nftIds: [createSaleDto.nftId],
        networks: [createSaleDto.network],
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
        ids: [createSaleDto.nftId],
        ownerIds: [user.id],
        networks: [createSaleDto.network],
        statuses: [NftStatus.ACTIVE],
      },
      { take: 1 },
    );
    if (count !== 1) {
      throw new BadRequestException('NFT is invalid');
    }

    const expiredAt = DateTime.now().plus({
      minutes: createSaleDto.expiryInMinutes,
    });
    const saleEntity = this.saleRepository.create({
      nftId: createSaleDto.nftId,
      network: createSaleDto.network,
      price: createSaleDto.price.toString(),
      currency: createSaleDto.currency,
      countryCode: createSaleDto.countryCode,
      topicId: createSaleDto.topicId,
      charityId: createSaleDto.charityId,
      expiredAt,
      ...defaults,
    });
    await saleEntity.save();
    return { sale: saleEntity };
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
  ): Promise<SaleEntity> {
    const saleEntity = await this.saleRepository.findOneByOrFail({
      network,
      hash,
    });

    return this._cancelSale(saleEntity);
  }

  private async _cancelSale(saleEntity: SaleEntity): Promise<SaleEntity> {
    if (!saleEntity.isListing()) {
      throw new BadRequestException('Sale is invalid');
    }

    saleEntity.status = SaleStatus.CANCELLED;
    await this.saleRepository.save(saleEntity);

    return saleEntity;
  }
}
