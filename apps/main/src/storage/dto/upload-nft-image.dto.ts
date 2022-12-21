import { ApiProperty } from '@nestjs/swagger';

export class UploadNftImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
