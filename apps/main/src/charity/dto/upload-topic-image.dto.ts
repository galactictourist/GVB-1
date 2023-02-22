import { ApiProperty } from '@nestjs/swagger';

export class UploadTopicImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
