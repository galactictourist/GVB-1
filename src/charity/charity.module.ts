import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharityService } from './charity.service';
import { CharityEntity } from './entity/charity.entity';
import { TopicEntity } from './entity/topic.entity';
import { CharityRepository } from './repository/charity.repository';
import { TopicRepository } from './repository/topic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CharityEntity, TopicEntity])],
  providers: [CharityService, CharityRepository, TopicRepository],
  exports: [CharityService, CharityRepository, TopicRepository],
})
export class CharityModule {}
