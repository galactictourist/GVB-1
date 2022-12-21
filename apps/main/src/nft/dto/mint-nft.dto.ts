import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class MintNftDto {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumberString()
  nonce?: string;
}
