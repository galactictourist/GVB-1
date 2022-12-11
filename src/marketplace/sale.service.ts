import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { uuid } from '~/lib';
import { NftService } from '~/nft/nft.service';
import { NftStatus } from '~/nft/types';
import { isCryptoCurrencyEnabled } from '~/types/blockchain';
import { ContextUser } from '~/types/user-request';
import { CreateMultiSaleDto, CreateSaleDto } from './dto/create-sale.dto';
import { FilterSaleParam } from './dto/filter-sale.param';
import { SearchSaleDto } from './dto/search-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleRepository } from './repository/sale.repository';
import { SaleStatus } from './types';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly nftService: NftService,
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

  async query(filterParam: FilterSaleParam) {
    const where = this._generateFindOptions(filterParam);

    return this.saleRepository.findAndCount({ where });
  }

  async count(filterParam: FilterSaleParam) {
    const where = this._generateFindOptions(filterParam);

    return this.saleRepository.count({
      where,
    });
  }

  async createMultiSale(
    createMultiSaleDto: CreateMultiSaleDto,
    defaults: DeepPartial<SaleEntity>,
    user: ContextUser,
  ) {
    return [];
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
      throw new BadRequestException('Curencty is not supported');
    }
    // TODO validate charity and country and topic

    // count existing active sale
    const countExistingSale = await this.count({
      userIds: [user.id],
      nftIds: [createSaleDto.nftId],
      networks: [createSaleDto.network],
      statuses: [SaleStatus.ACTIVE],
    });
    if (countExistingSale > 0) {
      throw new BadRequestException('Invalid NFTs');
    }

    const count = await this.nftService.count({
      ids: [createSaleDto.nftId],
      ownerIds: [user.id],
      networks: [createSaleDto.network],
      statuses: [NftStatus.ACTIVE],
    });
    if (count !== 1) {
      throw new BadRequestException('NFT is on sale');
    }

    const requestId = uuid();
    const expiredAt = DateTime.now().plus({
      minutes: createSaleDto.expiryInMinutes,
    });
    const saleEntity = this.saleRepository.create({
      nftId: createSaleDto.nftId,
      requestId,
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
    return { requestId, sale: saleEntity };
  }

  async updateNft(id: string, updateSaleDto: UpdateSaleDto, user: ContextUser) {
    const saleEntity = await this.saleRepository.findOneByOrFail({
      id,
    });
    if (saleEntity.userId !== user.id) {
      throw new BadRequestException('Sale owner mismatch');
    }
    saleEntity.price = updateSaleDto.price.toString();
    saleEntity.charityId = updateSaleDto.charityId;

    await saleEntity.save();
    return saleEntity;
  }
}
