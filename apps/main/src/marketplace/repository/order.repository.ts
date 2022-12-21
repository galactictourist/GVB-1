import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/main/lib/database/base-repository';
import { OrderEntity } from '../entity/order.entity';

@Injectable()
export class OrderRepository extends BaseRepository<OrderEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }
}
