import { Injectable } from '@nestjs/common';
import { CreateTopicAdminDto } from './dto/create-topic-admin.dto';
import { UpdateTopicAdminDto } from './dto/update-topic-admin.dto';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { TopicRepository } from './repository/topic.repository';

@Injectable()
export class TopicAdminService {
  constructor(
    private readonly toppicRepository: TopicRepository,
    private readonly charityToppicRepository: CharityTopicRepository,
  ) {}

  async createTopic(createTopicDto: CreateTopicAdminDto) {
    // TODO validate parentId is root topic (parentId = null)
    const topic = this.toppicRepository.create({
      name: createTopicDto.name,
      parentId: createTopicDto.parentId,
    });
    await topic.save();
    return topic;
  }

  async updateTopic(id: string, updateTopicDto: UpdateTopicAdminDto) {
    // TODO validate parentId is root topic (parentId = null)
    const updateResult = await this.toppicRepository.update(
      { id },
      {
        name: updateTopicDto.name,
        parentId: updateTopicDto.parentId,
      },
    );
    return updateResult;
  }
}
