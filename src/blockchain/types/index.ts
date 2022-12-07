import { BigNumberish } from 'ethers';

export interface AddSingleItem {
  account: string;
  collection: string;
  tokenId: BigNumberish;
  royaltyFee: BigNumberish;
  tokenURI: string;
  deadline: BigNumberish;
  nonce: BigNumberish;
}

export interface BuyItem {
  account: string;
  collection: string;
  seller: string;
  tokenId: BigNumberish;
  itemPrice: BigNumberish;
  additionalPrice: BigNumberish;
  charityAddress: string;
  charityFee: BigNumberish;
  deadline: BigNumberish;
  nonce: BigNumberish;
}
