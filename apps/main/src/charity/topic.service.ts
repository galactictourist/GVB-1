import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { CollectionRepository } from '../nft/repository/collection.repository';
import { CollectionStatus } from '../nft/types';
import { TopicEntity } from './entity/topic.entity';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { TopicRepository } from './repository/topic.repository';
import { TopicStatus } from './types';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly charityTopicRepository: CharityTopicRepository,
    private readonly collectionRepository: CollectionRepository,
  ) {}

  async getTopics(where: FindOptionsWhere<TopicEntity> = {}) {
    const [data, total] = await this.topicRepository.findAndCountBy(where);
    return { data, total };
  }

  async getCauseTopics() {
    const topParents = await this.topicRepository.find({
      select: {
        id: true,
        name: true,
      },
      where: {
        isParent: true,
        status: TopicStatus.ACTIVE,
      },
    });
    return topParents;
  }

  async getCauseChilds() {
    const topParents = await this.topicRepository.find({
      select: {
        id: true,
        name: true,
        children: {
          id: true,
          name: true,
        },
      },
      relations: {
        children: true,
      },
      where: {
        isParent: true,
        status: TopicStatus.ACTIVE,
      },
    });
    return topParents;
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

  async getCollectionDetails(topicId?: string) {
    let topicCollectionData: any[] = [];
    let whereQuery: any = {
      status: TopicStatus.ACTIVE,
      isParent: true,
    };
    if (topicId) {
      whereQuery['id'] = topicId;
    }
    const topicData = await this.topicRepository.find({
      select: {
        id: true,
        name: true,
        children: {
          id: true,
          name: true,
        },
      },
      relations: {
        children: true,
      },
      where: whereQuery,
    });
    if (topicData && topicData.length) {
      for (const topic of topicData) {
        let topicIdAry: any[] = [];
        for (const childTopic of topic.children) {
          topicIdAry.push(childTopic.id);
        }
        const collectionData = await this.collectionRepository.find({
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
          },
          where: {
            topicId: In([...topicIdAry]),
            status: CollectionStatus.PUBLISHED,
          },
        });
        topicCollectionData.push({
          id: topic.id,
          name: topic.name,
          collections: collectionData,
        });
      }
      return topicCollectionData;
    } else {
      return [];
    }
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
