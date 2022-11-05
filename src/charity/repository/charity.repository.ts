import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CharityEntity } from '../entity/charity.entity';

@Injectable()
export class CharityRepository extends Repository<CharityEntity> {
  constructor(private dataSource: DataSource) {
    super(CharityEntity, dataSource.createEntityManager());
  }
}
