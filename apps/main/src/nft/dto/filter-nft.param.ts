import { BlockchainNetwork } from '~/main/types/blockchain';
import { NftStatus } from '../types';

export interface FilterNftParam {
  ids?: string[];

  ownerIds?: string[];

  collectionIds?: string[];

  statuses?: NftStatus[];
  networks?: BlockchainNetwork[];
}
