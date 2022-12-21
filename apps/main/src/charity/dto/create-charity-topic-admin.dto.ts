import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsUUID } from 'class-validator';
import { IsEip55Address } from '~/main/shared/validator/is-eip55-address.validator';
import { CountryCode } from '~/main/types/country';

export class CreateCharityTopicAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  topicId: string;

  @ApiProperty()
  @IsDefined()
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty()
  @IsDefined()
  @IsEip55Address()
  wallet: string;
}
