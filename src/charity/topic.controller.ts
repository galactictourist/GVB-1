import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '~/auth/decorator/public.decorator';
import { formatResponse } from '~/types/response-data';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Public()
  @Get('')
  async getTopicList() {
    const topics = await this.topicService.getTopics();
    return formatResponse(topics.data);
  }

  @Public()
  @Get(':topicId')
  async getTopicDetails(@Param('topicId') topicId: string) {
    const topic = await this.topicService.getTopic(topicId);
    return formatResponse(topic);
  }

  @Public()
  @Get(':topicId/charities')
  async getTopicCharities(@Param('topicId') topicId: string) {
    const charities = await this.topicService.getTopicCharities(topicId);
    return formatResponse(charities.data);
  }
}
