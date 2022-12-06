import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { OrderEntity } from './entity/order.entity';
import { OrderRepository } from './repository/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async search(
    searchOrderDto: SearchOrderDto,
    defaults: FindOptionsWhere<OrderEntity>,
  ) {
    const where: FindOptionsWhere<OrderEntity> = {};
    if (
      searchOrderDto.filter?.sellerIds &&
      searchOrderDto.filter.sellerIds.length
    ) {
      where.sellerId = In(searchOrderDto.filter.sellerIds);
    }
    if (
      searchOrderDto.filter?.buyerIds &&
      searchOrderDto.filter.buyerIds.length
    ) {
      where.buyerId = In(searchOrderDto.filter.buyerIds);
    }

    const result = await this.orderRepository.simplePaginate(
      {
        ...where,
        ...defaults,
      },
      searchOrderDto.pagination,
    );
    return result;
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    defaults: DeepPartial<OrderEntity>,
  ) {
    const orderEntity = this.orderRepository.create({
      ...defaults,
    });

    await orderEntity.save();
    return orderEntity;
  }
}
