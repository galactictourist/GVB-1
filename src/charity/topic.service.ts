import { Injectable } from '@nestjs/common';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { TopicRepository } from './repository/topic.repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly charityTopicRepository: CharityTopicRepository,
  ) {}

  async getTopics() {
    const [data, total] = await this.topicRepository.findAndCountBy({});
    return { data, total };
  }

  async getTopic(topicId: string) {
    const topic = await this.topicRepository.findOneBy({
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
