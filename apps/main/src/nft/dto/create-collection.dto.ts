import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { StorageLabel } from '~/main/storage/types';
import { IsStorageId } from '~/main/storage/validator/is-storage-id.validator';

export class CreateCollectionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  @IsStorageId({ label: StorageLabel.COLLECTION_IMAGE })
  imageStorageId?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID('4')
  topicId?: string;
}
