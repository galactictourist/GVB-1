import { Injectable } from '@nestjs/common';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { TopicRepository } from './repository/topic.repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly toppicRepository: TopicRepository,
    private readonly charityToppicRepository: CharityTopicRepository,
  ) {}

  async getTopics() {
    const [data, total] = await this.toppicRepository.findAndCountBy({});
    return { data, total };
  }

  async getTopic(topicId: string) {
    const topic = await this.toppicRepository.findOneBy({
      id: topicId,
    });
    return topic;
  }

  async getTopicCharities(topicId: string) {
    const [data, total] = await this.charityToppicRepository.findAndCount({
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
