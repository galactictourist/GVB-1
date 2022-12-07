import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BlockchainNetwork } from '~/types/blockchain';

export class GenerateTokenIdDto {
  @ApiProperty()
  @IsEnum(BlockchainNetwork)
  network: BlockchainNetwork;
}
