import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEthereumAddress, IsUUID } from 'class-validator';

export class CreateCharityTopicAdminDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  topicId: string;

  // @ApiProperty({ enum: CountryCode })
  // @IsDefined()
  // @IsEnum(CountryCode)
  // countryCode: CountryCode;

  @ApiProperty()
  @IsDefined()
  @IsEthereumAddress()
  wallet: string;
}
