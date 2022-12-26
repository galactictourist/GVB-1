import { BigNumberish, Event } from 'ethers';

export interface Erc721TransferEvent {
  from: string;
  to: string;
  tokenId: BigNumberish;
  blockchainEvent: Event;
}

export interface SaleCancelledEvent {
  hash: string;
  account: string;
  blockchainEvent: Event;
}

export interface OrderCompletedEvent {
  hash: string;
  order: any;
  blockchainEvent: Event;
}
