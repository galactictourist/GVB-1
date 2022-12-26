import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/main/lib/database/base-repository';
import { EventProcessEntity } from '../entity/event-process.entity';

@Injectable()
export class EventProcessRepository extends BaseRepository<EventProcessEntity> {
  constructor(private dataSource: DataSource) {
    super(EventProcessEntity, dataSource.createEntityManager());
  }
}
