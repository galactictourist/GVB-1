import { TypedDataDomain, TypedDataField } from 'ethers';

export enum BlockchainEventStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface TypedData<T extends Record<string, any>> {
  domain: TypedDataDomain;
  primaryType?: string;
  types: Record<string, Array<TypedDataField>>;
  message: T;
}

export interface SaleContractData extends Record<string, any> {
  nftContract: string;
  seller: string;
  isMinted: boolean;
  tokenId: string;
  tokenURI: string;
  quantity: number;
  itemPrice: string;
  charityAddress: string;
  charityShare: number;
  royaltyFee: number;
  deadline: number;
  salt: string;
}
