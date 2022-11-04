import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CollectionEntity } from '../entity/collection.entity';

@Injectable()
export class CollectionRepository extends Repository<CollectionEntity> {
  constructor(private dataSource: DataSource) {
    super(CollectionEntity, dataSource.createEntityManager());
  }
}
