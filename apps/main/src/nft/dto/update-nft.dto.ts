import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateNftDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsBoolean()
  isMinted?: boolean;
}
