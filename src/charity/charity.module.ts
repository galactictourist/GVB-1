import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharityService } from './charity.service';
import { CharityEntity } from './entity/charity.entity';
import { TopicEntity } from './entity/topic.entity';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { CharityRepository } from './repository/charity.repository';
import { TopicRepository } from './repository/topic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CharityEntity, TopicEntity])],
  providers: [
    CharityService,
    CharityRepository,
    TopicRepository,
    CharityTopicRepository,
  ],
  exports: [
    CharityService,
    CharityRepository,
    TopicRepository,
    CharityTopicRepository,
  ],
})
export class CharityModule {}
