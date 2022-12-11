import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';
import { BlockchainNetwork, CryptoCurrency } from '~/types/blockchain';
import { CountryCode } from '~/types/country';

export class CreateSaleDto {
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
  @IsEnum(BlockchainNetwork)
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
