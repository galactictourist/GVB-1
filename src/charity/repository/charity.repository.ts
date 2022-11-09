import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/lib/database/base-repository';
import { CharityEntity } from '../entity/charity.entity';

@Injectable()
export class CharityRepository extends BaseRepository<CharityEntity> {
  constructor(private dataSource: DataSource) {
    super(CharityEntity, dataSource.createEntityManager());
  }
}
