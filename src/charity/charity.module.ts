import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharityController } from './charity.controller';
import { CharityService } from './charity.service';
import { CharityEntity } from './entity/charity.entity';
import { TopicEntity } from './entity/topic.entity';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { CharityRepository } from './repository/charity.repository';
import { TopicRepository } from './repository/topic.repository';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([CharityEntity, TopicEntity])],
  providers: [
    CharityService,
    CharityRepository,
    TopicService,
    TopicRepository,
    CharityTopicRepository,
  ],
  controllers: [CharityController, TopicController],
  exports: [
    CharityService,
    CharityRepository,
    TopicService,
    TopicRepository,
    CharityTopicRepository,
  ],
})
export class CharityModule {}
