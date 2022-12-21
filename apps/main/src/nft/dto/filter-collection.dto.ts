import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class FilterCollectionDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ownerIds?: string[];
}
