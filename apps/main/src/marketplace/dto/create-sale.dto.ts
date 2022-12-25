import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty()
  @IsString()
  clientSignature: string;

  @ApiProperty()
  @IsString()
  saleData: string;

  @ApiProperty()
  @IsString()
  serverSignature: string;
}
