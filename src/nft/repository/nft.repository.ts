import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/lib/database/base-repository';
import { NftEntity } from '../entity/nft.entity';

@Injectable()
export class NftRepository extends BaseRepository<NftEntity> {
  constructor(private dataSource: DataSource) {
    super(NftEntity, dataSource.createEntityManager());
  }
}
