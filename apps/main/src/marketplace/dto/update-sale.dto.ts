import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { CountryCode } from '~/main/types/country';

export class UpdateSaleDto {
  @ApiProperty()
  @IsUUID('4', { each: true })
  nftIds: string[];

  @ApiProperty()
  @IsEnum(CountryCode)
  countryCode?: CountryCode;

  @ApiProperty()
  @IsUUID('4')
  topicId?: string;

  @ApiProperty()
  @IsUUID('4')
  charityId?: string;

  @ApiProperty()
  @IsEnum(BlockchainNetwork)
  network?: BlockchainNetwork;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string | null;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  charityRate: number;
}
