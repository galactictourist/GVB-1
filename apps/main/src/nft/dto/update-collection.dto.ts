import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { IsStorageId } from '~/main/storage/validator/is-storage-id.validator';

export class UpdateCollectionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  @IsStorageId()
  imageStorageId?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID('4')
  topicId?: string;
}
