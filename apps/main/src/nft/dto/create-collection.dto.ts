import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
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
  @IsStorageId()
  imageStorageId?: string;
}
