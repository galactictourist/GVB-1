import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/lib/database/base-repository';
import { CollectionEntity } from '../entity/collection.entity';

@Injectable()
export class CollectionRepository extends BaseRepository<CollectionEntity> {
  constructor(private dataSource: DataSource) {
    super(CollectionEntity, dataSource.createEntityManager());
  }
}
