import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StorageLabel } from '~/main/storage/types';
import { IsStorageId } from '~/main/storage/validator/is-storage-id.validator';
import { TopicStatus } from '../types';

export class UpdateTopicAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;

  @ApiProperty({ enum: TopicStatus })
  @IsEnum(TopicStatus)
  status: TopicStatus;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  @IsStorageId({ label: StorageLabel.TOPIC_IMAGE })
  imageStorageId?: string;
}
