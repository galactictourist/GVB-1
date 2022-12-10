import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { SimplePaginationDto } from '~/types/dto/simple-pagination.dto';
import { SimpleSortDto } from '~/types/dto/simple-sort.dto';

class FilterNftDto {
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
