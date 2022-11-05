import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharityService } from './charity.service';
import { CharityEntity } from './entity/charity.entity';
import { TopicEntity } from './entity/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharityEntity, TopicEntity])],
  providers: [CharityService],
})
export class CharityModule {}
