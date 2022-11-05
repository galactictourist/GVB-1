import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NftEntity } from '../entity/nft.entity';

@Injectable()
export class NftRepository extends Repository<NftEntity> {
  constructor(private dataSource: DataSource) {
    super(NftEntity, dataSource.createEntityManager());
  }
}
