import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateCharityAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;
}
