import { Injectable } from '@nestjs/common';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { CharityRepository } from './repository/charity.repository';
import { CharityStatus } from './types';

@Injectable()
export class CharityService {
  constructor(
    private readonly charityRepository: CharityRepository,
    private readonly charityTopicRepository: CharityTopicRepository,
  ) {}

  async getActiveCharities() {
    const [data, count] = await this.charityRepository.findAndCountBy({
      status: CharityStatus.ACTIVE,
    });
    return { data, count };
  }

  async getCharity(charityId: string) {
    const charity = await this.charityRepository.findOneBy({
      id: charityId,
    });
    return charity;
  }

  async getCharityTopics(charityId: string) {
    const [data, total] = await this.charityTopicRepository.findAndCount({
      relationLoadStrategy: 'query',
      relations: {
        topic: true,
      },
      where: {
        charityId: charityId,
      },
    });
    return {
      data,
      total,
    };
  }
}
