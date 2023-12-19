import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { Roles } from '~/main/auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '~/main/auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '~/main/auth/guard/roles.guard';
import { ResponseData, formatResponse } from '~/main/types/response-data';
import { AdminRole } from '~/main/user/types';
import { appConfig } from '../config/app.config';
import { StorageEntity } from '../storage/entity/storage.entity';
import { StorageService } from '../storage/storage.service';
import { StorageLabel } from '../storage/types';
import { CreateTopicAdminDto } from './dto/create-topic-admin.dto';
import { UpdateTopicAdminDto } from './dto/update-topic-admin.dto';
import { UploadTopicImageDto } from './dto/upload-topic-image.dto';
import { TopicAdminService } from './topic-admin.service';

@Controller('admin/topics')
@Public()
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@Roles(Object.values(AdminRole))
@ApiBearerAuth()
@ApiTags('topic', 'admin', 'admin/topic')
export class TopicAdminController {
  constructor(
    private readonly topicAdminService: TopicAdminService,
    private readonly storageService: StorageService,
  ) {}

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

  @Post('image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadTopicImageDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadTopicImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: new RegExp('.(gif|jpg|jpeg|png|mp4)$'),
          }),
          new MaxFileSizeValidator({
            maxSize: appConfig().maxFileUploadSize,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseData<StorageEntity>> {
    const storage = await this.storageService.storePublicReadFile(file, {
      label: StorageLabel.TOPIC_IMAGE,
    });
    return formatResponse(storage);
  }
}
