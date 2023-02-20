import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, IsUUID } from 'class-validator';
import { StorageLabel } from '~/main/storage/types';
import { IsStorageId } from '~/main/storage/validator/is-storage-id.validator';

export class CreateTopicAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  @IsStorageId({ label: StorageLabel.TOPIC_IMAGE })
  imageStorageId?: string;
}
