import { TypedDataDomain, TypedDataField } from 'ethers';

export enum BlockchainEventStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ContractStandard {
  ERC721 = 'ERC721',
  GAB_MARKETPLACE_V1 = 'GAB_MARKETPLACE_V1',
}

export enum ItemType {
  ERC721 = 0,
  ERC1155 = 1,
}

export interface TypedData<T extends Record<string, any>> {
  domain: TypedDataDomain;
  primaryType?: string;
  types: Record<string, Array<TypedDataField>>;
  message: T;
}

export interface SaleContractData extends Record<string, any> {
  nftContract: string;
  itemType: ItemType;
  seller: string;
  artist: string;
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
