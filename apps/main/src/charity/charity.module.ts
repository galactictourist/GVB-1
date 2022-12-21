import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharityAdminController } from './charity-admin.controller';
import { CharityAdminService } from './charity-admin.service';
import { CharityController } from './charity.controller';
import { CharityService } from './charity.service';
import { CharityEntity } from './entity/charity.entity';
import { TopicEntity } from './entity/topic.entity';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { CharityRepository } from './repository/charity.repository';
import { TopicRepository } from './repository/topic.repository';
import { TopicAdminController } from './topic-admin.controller';
import { TopicAdminService } from './topic-admin.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([CharityEntity, TopicEntity])],
  providers: [
    CharityService,
    CharityRepository,
    CharityAdminService,
    TopicService,
    TopicRepository,
    TopicAdminService,
    CharityTopicRepository,
  ],
  controllers: [
    CharityController,
    CharityAdminController,
    TopicController,
    TopicAdminController,
  ],
  exports: [
    CharityService,
    CharityAdminService,
    CharityRepository,
    TopicService,
    TopicAdminService,
    TopicRepository,
    CharityTopicRepository,
  ],
})
export class CharityModule {}
