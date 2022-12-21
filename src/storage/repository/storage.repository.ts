import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/lib/database/base-repository';
import { StorageEntity } from '../entity/storage.entity';

@Injectable()
export class StorageRepository extends BaseRepository<StorageEntity> {
  constructor(private dataSource: DataSource) {
    super(StorageEntity, dataSource.createEntityManager());
  }
}
