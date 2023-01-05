import { BlockchainNetwork, CryptoCurrency } from '~/main/types/blockchain';
import { CountryCode } from '~/main/types/country';

export class SaleData {
  userId: string;

  nftId: string;

  countryCode: CountryCode;

  topicId: string;

  charityId: string;

  charityShare: number;

  charityWallet: string;

  network: BlockchainNetwork;

  currency: CryptoCurrency;

  price: string;

  quantity: number;

  expiredAt: number;

  salt: string; // 77-length number string = uint256
}

export interface SigningData {
  signingData: string;
  saleData: string;
  serverSignature: string;
}
