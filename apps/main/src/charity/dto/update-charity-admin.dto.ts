import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CharityStatus } from '../types';

export class UpdateCharityAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: CharityStatus })
  @IsOptional()
  @IsEnum(CharityStatus)
  status?: CharityStatus;
}
