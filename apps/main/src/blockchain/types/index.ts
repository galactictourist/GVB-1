import { BigNumberish, TypedDataDomain, TypedDataField } from 'ethers';

export enum BlockchainEventStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface TypedData<T extends Record<string, any>> {
  domain: TypedDataDomain;
  primaryType?: string;
  types: Record<string, Array<TypedDataField>>;
  value: T;
}

export interface SaleContractData extends Record<string, any> {
  nftContract: string;
  seller: string;
  isMinted: boolean;
  tokenId: string;
  tokenURI: string;
  quantity: BigNumberish;
  itemAmount: BigNumberish; // listed price
  additionalPrice: BigNumberish; // additional price for charity
  charityAddress: string;
  charityShare: BigNumberish;
  royaltyFee: BigNumberish;
  deadline: BigNumberish; // expiry time of listed NFT
  salt: BigNumberish;
}
