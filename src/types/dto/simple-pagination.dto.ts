import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class SimplePaginationDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  page?: number;
}
