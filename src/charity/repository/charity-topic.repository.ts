import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/lib/database/base-repository';
import { CharityTopicEntity } from '../entity/charity-topic.entity';

@Injectable()
export class CharityTopicRepository extends BaseRepository<CharityTopicEntity> {
  constructor(private dataSource: DataSource) {
    super(CharityTopicEntity, dataSource.createEntityManager());
  }
}
