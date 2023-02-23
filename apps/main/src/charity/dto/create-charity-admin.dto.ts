import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { CharityStatus } from '../types';

export class CreateCharityAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ enum: CharityStatus })
  @IsOptional()
  @IsEnum(CharityStatus)
  status?: CharityStatus;
}
