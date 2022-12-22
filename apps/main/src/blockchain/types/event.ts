import { BigNumberish } from 'ethers';

export interface Erc721TransferEvent {
  from: string;
  to: string;
  tokenId: BigNumberish;
}

export interface SaleCancelledEvent {
  orderHash: string;
  account: string;
}

export interface OrderCompletedEvent {
  orderHash: string;
  order: any;
}
