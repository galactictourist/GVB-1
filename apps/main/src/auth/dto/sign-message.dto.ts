import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignMessageDto {
  @ApiProperty()
  @IsString()
  privateKey: string;

  @ApiProperty()
  @IsString()
  message: string;
}
