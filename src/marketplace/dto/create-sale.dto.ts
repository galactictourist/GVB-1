import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { BlockchainNetwork } from '~/types/blockchain';
import { CountryCode } from '~/types/country';

export class CreateSaleDto {
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
  networCode?: BlockchainNetwork;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string | null;
}
