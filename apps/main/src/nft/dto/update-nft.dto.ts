import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { BlockchainNetwork } from '~/main/types/blockchain';

export class UpdateNftDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  @Max(8000)
  royalty?: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsEnum(BlockchainNetwork)
  network?: BlockchainNetwork;
}
