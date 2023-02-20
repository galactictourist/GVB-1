import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { StorageLabel } from '../storage/types';
import { CreateTopicAdminDto } from './dto/create-topic-admin.dto';
import { UpdateTopicAdminDto } from './dto/update-topic-admin.dto';
import { TopicRepository } from './repository/topic.repository';

@Injectable()
export class TopicAdminService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly storageService: StorageService,
  ) {}

  async getTopics() {
    const [data, total] = await this.topicRepository.findAndCountBy({});
    return { data, total };
  }

  async createTopic(createTopicDto: CreateTopicAdminDto) {
    await this.validateParent(createTopicDto.parentId);
    let imageUrl: string | undefined;
    if (createTopicDto.imageStorageId) {
      try {
        const storage = await this.storageService.getStorage({
          id: createTopicDto.imageStorageId,
          label: StorageLabel.TOPIC_IMAGE,
        });
        imageUrl = storage.url;
      } catch (e) {
        throw new BadRequestException('Invalid file');
      }
    }

    const topic = this.topicRepository.create({
      name: createTopicDto.name,
      parentId: createTopicDto.parentId,
      imageStorageId: createTopicDto.imageStorageId,
      imageUrl,
      status: createTopicDto.status,
    });
    await topic.save();
    return topic;
  }

  async updateTopic(id: string, updateTopicDto: UpdateTopicAdminDto) {
    let imageUrl: string | undefined;
    if (updateTopicDto.imageStorageId) {
      try {
        const storage = await this.storageService.getStorage({
          id: updateTopicDto.imageStorageId,
          label: StorageLabel.TOPIC_IMAGE,
        });
        imageUrl = storage.url;
      } catch (e) {
        throw new BadRequestException('Invalid file');
      }
    }

    await this.validateParent(updateTopicDto.parentId);
    const topicEntity = await this.topicRepository.findOneByOrFail({ id });
    topicEntity.name = updateTopicDto.name;
    topicEntity.parentId = updateTopicDto.parentId;
    topicEntity.status = updateTopicDto.status;
    if (updateTopicDto.imageStorageId) {
      topicEntity.imageStorageId = updateTopicDto.imageStorageId;
      topicEntity.imageUrl = imageUrl;
    }
    await topicEntity.save();
    return topicEntity;
  }

  private async validateParent(parentId?: string) {
    if (parentId) {
      const parentTopic = await this.topicRepository.findOneByOrFail({
        id: parentId,
      });
      if (parentTopic.parentId) {
        throw new BadRequestException('Parent topic is invalid');
      }
    }
  }
}
