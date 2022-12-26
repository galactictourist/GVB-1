import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BlockchainNetwork, CryptoCurrency } from '~/main/types/blockchain';
import { CountryCode } from '~/main/types/country';
import { IsActiveNetwork } from '~/main/types/validator/is-active-network.validator';

export class SigningSaleDto {
  @ApiProperty()
  @IsUUID('4')
  nftId: string;

  @ApiProperty()
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty()
  @IsUUID('4')
  topicId: string;

  @ApiProperty()
  @IsUUID('4')
  charityId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(10000)
  charityShare?: number;

  @ApiProperty()
  @IsEnum(BlockchainNetwork)
  @IsActiveNetwork()
  network: BlockchainNetwork;

  @ApiProperty()
  @IsEnum(CryptoCurrency)
  currency: CryptoCurrency;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 18 })
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(15)
  expiryInMinutes: number;
}
