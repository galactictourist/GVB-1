import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/main/lib/database/base-repository';
import { TopicEntity } from '../entity/topic.entity';

@Injectable()
export class TopicRepository extends BaseRepository<TopicEntity> {
  constructor(private dataSource: DataSource) {
    super(TopicEntity, dataSource.createEntityManager());
  }
}
