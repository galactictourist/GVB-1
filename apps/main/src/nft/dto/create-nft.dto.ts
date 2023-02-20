import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  ValidateNested,
} from 'class-validator';
import { StorageLabel } from '~/main/storage/types';
import { IsStorageId } from '~/main/storage/validator/is-storage-id.validator';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { IsActiveNetwork } from '~/main/types/validator/is-active-network.validator';
import { DisplayType, MetadataAttribute } from '../types';

class MetadataAttributeDto implements MetadataAttribute {
  @ApiProperty({ nullable: true, required: false })
  @IsString()
  trait_type?: string;

  @ApiProperty()
  value: any;

  @ApiProperty({ nullable: true, required: false })
  @IsNumber()
  max_value?: number;

  @ApiProperty({ enum: DisplayType, nullable: true, required: false })
  @IsOptional()
  @IsEnum(DisplayType)
  display_type?: DisplayType;
}

class MetadataDto implements MetadataDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  external_url?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  animation_url?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  youtube_url?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  @Matches(/^[0-9a-f]{6,6}$/i, {
    message:
      'Backgroud color must be a six-character hexadecimal without a pre-pended #',
  })
  @IsHexColor()
  background_color?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetadataAttributeDto)
  attributes?: MetadataAttributeDto[];
}

export class CreateNftDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Max(8000)
  royalty: number;

  @ApiProperty({ enum: BlockchainNetwork })
  @IsEnum(BlockchainNetwork)
  @IsActiveNetwork()
  network: BlockchainNetwork;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  @IsStorageId({ label: StorageLabel.NFT_IMAGE })
  imageStorageId?: string;
}
