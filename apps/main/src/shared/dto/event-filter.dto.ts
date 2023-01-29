import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class EventFilterDto {
  @ApiProperty()
  @IsPositive()
  from: number;

  @ApiProperty()
  @IsPositive()
  to: number;
}
