import { Injectable } from '@nestjs/common';
import { CharityTopicEntity } from './entity/charity-topic.entity';
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
    const [data, count] = await this.charityRepository.findAndCount({
      relations: {
        charityTopics: true,
      },
      where: {
        status: CharityStatus.ACTIVE,
      },
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

  async getCharityTopic(
    charityId: string,
    // topicId: string,
    // countryCode: CountryCode,
  ): Promise<CharityTopicEntity | null> {
    const entity = await this.charityTopicRepository.findOne({
      // relationLoadStrategy: 'query',
      // relations: {
      //   topic: true,
      // },
      where: {
        charityId,
        // topicId,
        // countryCode,
      },
    });
    return entity;
  }
}
