import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class UpdateCharityAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;
}
