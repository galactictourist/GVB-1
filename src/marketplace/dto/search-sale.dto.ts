import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { SimplePaginationDto } from '~/types/dto/simple-pagination.dto';
import { SimpleSortDto } from '~/types/dto/simple-sort.dto';

class FilterSaleDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: string[];
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
