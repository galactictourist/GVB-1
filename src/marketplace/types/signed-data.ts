import { BigNumberish } from 'ethers';

export interface SignedData {
  version: number; // 1, 2, 3
  seller: string; // seller address
  token: {
    type: number; // 1 = ERC721, 2 = ERC1155
    address: string; // NFT smartcontract address
    id: BigNumberish; // NFT token ID
    quantity: number; // quantity
    price: BigNumberish; // price
    currency: string; // ERC20 address; 0x0 = native currency
  };
  charity: {
    countryCode: string; // 2-char country code
    address: string; // charity adderss
    share: number; // 0 - 10000 - charity share percentage
  };
  topic: {
    id: string; // more information
    name: string; // more information
  };
  createdAt: number;
  expiredAt: number;
  salt: string; // 77-length number string = uint256
}
