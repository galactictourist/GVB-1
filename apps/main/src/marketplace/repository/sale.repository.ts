import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/main/lib/database/base-repository';
import { SaleEntity } from '../entity/sale.entity';

@Injectable()
export class SaleRepository extends BaseRepository<SaleEntity> {
  constructor(private dataSource: DataSource) {
    super(SaleEntity, dataSource.createEntityManager());
  }
}
