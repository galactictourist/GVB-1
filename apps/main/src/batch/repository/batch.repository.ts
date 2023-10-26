import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/main/lib/database/base-repository';
import { BatchEntity } from '../entity/batch.entity';

@Injectable()
export class BatchRepository extends BaseRepository<BatchEntity> {
  constructor(private dataSource: DataSource) {
    super(BatchEntity, dataSource.createEntityManager());
  }
}
