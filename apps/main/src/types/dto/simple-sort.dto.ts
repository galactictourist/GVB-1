import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SimpleSortDto {
  @ApiProperty({ nullable: true, required: true })
  field: string;

  @ApiProperty({ enum: SortOrder, nullable: true, required: true })
  @IsEnum(SortOrder)
  order: SortOrder;
}
