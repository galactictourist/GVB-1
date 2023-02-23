import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { TopicEntity } from './entity/topic.entity';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { TopicRepository } from './repository/topic.repository';
import { TopicStatus } from './types';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly charityTopicRepository: CharityTopicRepository,
  ) {}

  async getTopics(where: FindOptionsWhere<TopicEntity> = {}) {
    const [data, total] = await this.topicRepository.findAndCountBy(where);
    return { data, total };
  }

  async getActiveTopics() {
    const [data, total] = await this.topicRepository.findAndCountBy({
      status: TopicStatus.ACTIVE,
    });
    return { data, total };
  }

  async getTopic(topicId: string) {
    const topic = await this.topicRepository.findOneByOrFail({
      id: topicId,
    });
    return topic;
  }

  async getTopicCharities(topicId: string) {
    const [data, total] = await this.charityTopicRepository.findAndCount({
      relationLoadStrategy: 'query',
      relations: {
        charity: true,
      },
      where: {
        topicId: topicId,
      },
    });
    return {
      data,
      total,
    };
  }
}
