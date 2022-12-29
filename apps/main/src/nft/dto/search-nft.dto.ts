import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { SimplePaginationDto } from '~/main/types/dto/simple-pagination.dto';
import { SimpleSortDto } from '~/main/types/dto/simple-sort.dto';

class FilterNftDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ids?: string[];

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ownerIds?: string[];

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  collectionIds?: string[];

  @ApiProperty({
    isArray: true,
    enum: BlockchainNetwork,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(BlockchainNetwork, { each: true })
  networks?: BlockchainNetwork[];
}

export class SearchNftDto {
  @ApiProperty({ nullable: true, required: false })
  @ValidateNested()
  @Type(() => FilterNftDto)
  filter?: FilterNftDto;

  @ApiProperty({ nullable: true, required: false })
  @ValidateNested()
  @Type(() => SimplePaginationDto)
  pagination?: SimplePaginationDto;

  @ApiProperty({ nullable: true, required: false })
  @ValidateNested()
  @Type(() => SimpleSortDto)
  sort?: SimpleSortDto;
}
