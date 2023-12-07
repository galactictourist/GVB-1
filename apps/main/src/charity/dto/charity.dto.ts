import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { CharityStatus } from '../types';

export class CharityDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  causeId: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  wallet: string;

  @ApiProperty({ enum: CharityStatus, nullable: true, required: false })
  @IsOptional()
  @IsEnum(CharityStatus)
  status: CharityStatus;
}
