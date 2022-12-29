import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsEthereumAddress, IsUUID } from 'class-validator';
import { CountryCode } from '~/main/types/country';

export class CreateCharityTopicAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  topicId: string;

  @ApiProperty({ enum: CountryCode })
  @IsDefined()
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty()
  @IsDefined()
  @IsEthereumAddress()
  wallet: string;
}
