import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsEthereumAddress, IsOptional } from 'class-validator';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { IsActiveNetwork } from '~/main/types/validator/is-active-network.validator';

export class ImportNftsDto {
  @ApiProperty({ enum: BlockchainNetwork })
  @IsEnum(BlockchainNetwork)
  @IsActiveNetwork()
  network: BlockchainNetwork;

  @ApiProperty()
  @IsEthereumAddress()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  owner: string;
}
