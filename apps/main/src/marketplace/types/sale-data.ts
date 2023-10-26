import {
  BatchContractData,
  SaleContractData,
  TypedData,
} from '~/main/blockchain/types';
import { BlockchainNetwork, CryptoCurrency } from '~/main/types/blockchain';

export class SaleData {
  userId: string;

  nftId: string;

  // countryCode: CountryCode;

  topicId: string;

  charityId: string;

  charityShare: number;

  charityWallet: string;

  network: BlockchainNetwork;

  currency: CryptoCurrency;

  price: string;

  quantity: number;

  expiredAt: number;

  salt?: string; // 77-length number string = uint256
}

export interface RawSigningData {
  signingData: TypedData<SaleContractData>;
  saleData: SaleData;
}

export interface RawBatchData {
  signingData: TypedData<BatchContractData>;
  batch: Batch;
}

export interface SigningData {
  signingData: string;
  saleData: string;
  serverSignature: string;
}

export interface Batch {
  collectionId: string;
  charityId: string;
  charityShare: number;
  nfts: SaleData[];
  salt: string;
}
