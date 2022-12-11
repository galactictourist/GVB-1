import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
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

export class CreateMultiSaleDto {
  @ApiProperty()
  @IsArray()
  @MinLength(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDto)
  sales: CreateSaleDto[];
}
