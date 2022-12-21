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
import { BlockchainNetwork } from '~/main/types/blockchain';
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

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsEnum(DisplayType)
  display_type?: DisplayType;
}

class MetadataDto implements MetadataDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  description?: string;

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

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  @Max(8000)
  royalty?: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsEnum(BlockchainNetwork)
  network?: BlockchainNetwork;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  // @IsStorageId() // TODO implement validation
  imageStorageId?: string;
}