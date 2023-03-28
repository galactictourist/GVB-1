import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional, IsString, IsUUID } from 'class-validator';
import { StorageLabel } from '~/main/storage/types';
import { IsStorageId } from '~/main/storage/validator/is-storage-id.validator';

export class UpdateCollectionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsEthereumAddress({ message: 'Not a valid Ethereum address.' })
  artistAddress: string;

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
