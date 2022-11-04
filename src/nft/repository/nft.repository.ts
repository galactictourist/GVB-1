import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CollectionEntity } from '../entity/collection.entity';
import { NftEntity } from '../entity/nft.entity';

@Injectable()
export class NftRepository extends Repository<NftEntity> {
  constructor(private dataSource: DataSource) {
    super(CollectionEntity, dataSource.createEntityManager());
  }
}
