import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum, IsUUID
} from 'class-validator';
import { CheckSale } from '../types';

export class CheckSaleDto {
  @ApiProperty()
  @IsUUID('4')
  nftId: string;

  @ApiProperty({ enum: CheckSale })
  @IsEnum(CheckSale)
  actionStatus: CheckSale;
}
