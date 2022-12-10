import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BlockchainNetwork } from '~/types/blockchain';
import { CountryCode } from '~/types/country';
import { SimplePaginationDto } from '~/types/dto/simple-pagination.dto';
import { SimpleSortDto } from '~/types/dto/simple-sort.dto';

class FilterSaleDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: string[];

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  nftIds?: string[];

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  charityIds?: string[];

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(CountryCode, { each: true })
  countryCodes?: CountryCode[];

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(BlockchainNetwork, { each: true })
  networks?: BlockchainNetwork[];
}

export class SearchSaleDto {
  @ApiProperty({ nullable: true, required: false })
  @ValidateNested()
  @Type(() => FilterSaleDto)
  filter?: FilterSaleDto;

  @ApiProperty({ nullable: true, required: false })
  @ValidateNested()
  @Type(() => SimplePaginationDto)
  pagination?: SimplePaginationDto;

  @ApiProperty({ nullable: true, required: false })
  @ValidateNested()
  @Type(() => SimpleSortDto)
  sort?: SimpleSortDto;
}
