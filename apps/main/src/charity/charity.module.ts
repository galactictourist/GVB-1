import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { CharityAdminController } from './charity-admin.controller';
import { CharityAdminService } from './charity-admin.service';
import { CharityController } from './charity.controller';
import { CharityService } from './charity.service';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { CharityRepository } from './repository/charity.repository';
import { TopicRepository } from './repository/topic.repository';
import { TopicAdminController } from './topic-admin.controller';
import { TopicAdminService } from './topic-admin.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [StorageModule],
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
