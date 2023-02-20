import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicAdminDto } from './dto/create-topic-admin.dto';
import { UpdateTopicAdminDto } from './dto/update-topic-admin.dto';
import { TopicRepository } from './repository/topic.repository';

@Injectable()
export class TopicAdminService {
  constructor(private readonly topicRepository: TopicRepository) {}

  async getTopics() {
    const [data, total] = await this.topicRepository.findAndCountBy({});
    return { data, total };
  }

  async createTopic(createTopicDto: CreateTopicAdminDto) {
    await this.validateParent(createTopicDto.parentId);
    const topic = this.topicRepository.create({
      name: createTopicDto.name,
      parentId: createTopicDto.parentId,
    });
    await topic.save();
    return topic;
  }

  async updateTopic(id: string, updateTopicDto: UpdateTopicAdminDto) {
    await this.validateParent(updateTopicDto.parentId);
    const topic = await this.topicRepository.findOneByOrFail({ id });
    topic.name = updateTopicDto.name;
    topic.parentId = updateTopicDto.parentId;
    await topic.save();
    return topic;
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
