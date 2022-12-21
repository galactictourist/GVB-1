import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { Roles } from '~/main/auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '~/main/auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '~/main/auth/guard/roles.guard';
import { formatResponse } from '~/main/types/response-data';
import { AdminRole } from '~/main/user/types';
import { CreateTopicAdminDto } from './dto/create-topic-admin.dto';
import { UpdateTopicAdminDto } from './dto/update-topic-admin.dto';
import { TopicAdminService } from './topic-admin.service';

@Controller('admin/topics')
@Public()
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@Roles(Object.values(AdminRole))
@ApiBearerAuth()
@ApiTags('topic', 'admin', 'admin/topic')
export class TopicAdminController {
  constructor(private readonly topicAdminService: TopicAdminService) {}

  @Get('')
  async getTopicList() {
    const topics = await this.topicAdminService.getTopics();
    return formatResponse(topics.data);
  }

  @Post('')
  async createTopic(@Body() createTopicAdminDto: CreateTopicAdminDto) {
    const topic = await this.topicAdminService.createTopic(createTopicAdminDto);
    return formatResponse(topic);
  }

  @Put(':topicId')
  async updateTopic(
    @Param('topicId') topicId: string,
    @Body() updateTopicAdminDto: UpdateTopicAdminDto,
  ) {
    const topic = await this.topicAdminService.updateTopic(
      topicId,
      updateTopicAdminDto,
    );
    return formatResponse(topic);
  }
}
