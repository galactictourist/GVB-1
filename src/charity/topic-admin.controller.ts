import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/auth/decorator/public.decorator';
import { Roles } from '~/auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '~/auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '~/auth/guard/roles.guard';
import { formatResponse } from '~/types/response-data';
import { AdminRole } from '~/user/types';
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
  constructor(private readonly topicService: TopicAdminService) {}

  @Post('')
  async createTopic(@Body() createTopicAdminDto: CreateTopicAdminDto) {
    const topic = await this.topicService.createTopic(createTopicAdminDto);
    return formatResponse(topic);
  }

  @Put(':topicId')
  async updateTopic(
    @Param('topicId') topicId: string,
    @Body() updateTopicAdminDto: UpdateTopicAdminDto,
  ) {
    const topic = await this.topicService.updateTopic(
      topicId,
      updateTopicAdminDto,
    );
    return formatResponse(topic);
  }
}
