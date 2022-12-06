import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { ContextUser } from '~/types/user-request';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleRepository } from './repository/sale.repository';

@Injectable()
export class SaleService {
  constructor(private readonly saleRepository: SaleRepository) {}

  async search(
    searchSaleDto: SearchSaleDto,
    defaults: FindOptionsWhere<SaleEntity>,
  ) {
    const where: FindOptionsWhere<SaleEntity> = {};
    if (searchSaleDto.filter?.userIds && searchSaleDto.filter.userIds.length) {
      where.userId = In(searchSaleDto.filter.userIds);
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

  async createSale(
    createSaleDto: CreateSaleDto,
    defaults: DeepPartial<SaleEntity>,
  ) {
    const saleEntity = this.saleRepository.create({
      ...defaults,
    });

    await saleEntity.save();
    return saleEntity;
  }

  async updateNft(id: string, updateSaleDto: UpdateSaleDto, user: ContextUser) {
    const saleEntity = await this.saleRepository.findOneBy({
      id,
    });
    if (!saleEntity) {
      throw new NotFoundException('Sale not found');
    }
    if (saleEntity.userId !== user.id) {
      throw new BadRequestException('Sale owner mismatch');
    }
    saleEntity.price = updateSaleDto.price.toString();
    saleEntity.charityId = updateSaleDto.charityId;

    await saleEntity.save();
    return saleEntity;
  }
}
