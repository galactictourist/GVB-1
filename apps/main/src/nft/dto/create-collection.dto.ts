import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString, IsUUID } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsEthereumAddress({ message: 'Not a valid Ethereum address.' })
  contractAddress: string;

  // @ApiProperty({ nullable: true, required: false })
  // @IsOptional()
  // @IsUUID()
  // @IsStorageId({ label: StorageLabel.COLLECTION_IMAGE })
  // imageStorageId?: string;

  @ApiProperty({ nullable: true, required: false })
  // @IsOptional()
  @IsUUID('4')
  topicId?: string;

  @ApiProperty()
  @IsString()
  @IsEthereumAddress({ message: 'Not a valid Ethereum address.' })
  artistAddress: string;
}
