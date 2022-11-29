import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTopicAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;
}