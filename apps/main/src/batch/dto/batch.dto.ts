import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateBatchDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  collectionId: string;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  charityId: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(1000)
  @Max(10000)
  charityShare: number;

  @ApiProperty()
  @IsArray()
  nfts: string;

  @ApiProperty()
  @IsString()
  clientSignature: string;

  @ApiProperty()
  @IsString()
  serverSignature: string;
}
