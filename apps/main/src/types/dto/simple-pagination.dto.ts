import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max } from 'class-validator';

export class SimplePaginationDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  @Max(100)
  limit?: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  page?: number;
}
