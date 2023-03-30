import {
  IsEnum,
  IsNumber, IsPositive,
  IsUUID,
  Max,
  Min
} from 'class-validator';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { IsActiveNetwork } from '~/main/types/validator/is-active-network.validator';

export class ListNftsDto {
  @IsUUID('4')
  collectionId: string;

  @IsNumber()
  nftTokenId: number;
  
  @IsUUID('4')
  charityId: string;

  @IsEnum(BlockchainNetwork)
  @IsActiveNetwork()
  network: BlockchainNetwork;

  @IsNumber()
  @Min(1000)
  @Max(10000)
  charityShare: number;

  @IsNumber()
  @Min(1)
  listNftQuantity: number;

  @IsNumber({ maxDecimalPlaces: 18 })
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(15)
  expiryInMinutes: number;
}
