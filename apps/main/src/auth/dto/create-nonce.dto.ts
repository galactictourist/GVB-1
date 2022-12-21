import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNonceDto {
  @ApiProperty()
  @IsString()
  wallet: string;
}
