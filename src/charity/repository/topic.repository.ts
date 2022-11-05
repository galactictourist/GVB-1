import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TopicEntity } from '../entity/topic.entity';

@Injectable()
export class TopicRepository extends Repository<TopicEntity> {
  constructor(private dataSource: DataSource) {
    super(TopicEntity, dataSource.createEntityManager());
  }
}
