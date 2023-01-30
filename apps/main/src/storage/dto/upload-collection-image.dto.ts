import { ApiProperty } from '@nestjs/swagger';

export class UploadCollectionImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
