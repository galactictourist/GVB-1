import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID('4')
  saleId: string;
}
