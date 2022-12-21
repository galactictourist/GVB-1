import { BlockchainNetwork } from '~/types/blockchain';
import { SaleStatus } from '../types';

export interface FilterSaleParam {
  ids?: string[];

  userIds?: string[];
  nftIds?: string[];

  statuses?: SaleStatus[];
  networks?: BlockchainNetwork[];
}
