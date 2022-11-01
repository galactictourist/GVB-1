import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninWalletDto {
  @ApiProperty()
  @IsString()
  wallet: string;

  @ApiProperty()
  @IsString()
  signature: string;
}
