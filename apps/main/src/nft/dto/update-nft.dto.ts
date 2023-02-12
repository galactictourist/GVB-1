import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNftDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
