import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { formatResponse } from '~/main/types/response-data';
import { TopicService } from './topic.service';

@Controller('topics')
@ApiTags('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Public()
  @Get('')
  async getTopicList() {
    const topics = await this.topicService.getTopics();
    return formatResponse(topics.data);
  }

  @Public()
  @Get('causes')
  async getCauses() {
    const causes = await this.topicService.getCauseTopics();
    return formatResponse(causes);
  }
  
  @Public()
  @Get('causes/childs')
  async getCauseChilds() {
    const causes = await this.topicService.getCauseChilds();
    return formatResponse(causes);
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

  @Public()
  @Post('causes/collections')
  async getTopicCollectionDetails(@Body('topicId') topicId?: string) {
    const topicData = await this.topicService.getCollectionDetails(topicId);
    return formatResponse(topicData);
  }
}
