import { BigNumberish, Event } from 'ethers';

export interface Erc721TransferEvent {
  from: string;
  to: string;
  tokenId: BigNumberish;
  blockchainEvent: Event;
}

export interface SaleCancelledEvent {
  cancelResults: boolean[];
  cancelStatus: string[];
  ordersHash: string[];
  blockchainEvent: Event;
}

export interface SaleCancelledEventV1 {
  hash: string;
  account: string;
  blockchainEvent: Event;
}

export interface OrderCompletedEvent {
  ordersHash: string[];
  ordersResult: boolean[];
  ordersStatus: string[];
  blockchainEvent: Event;
}

export interface OrderCompletedEventV1 {
  hash: string;
  order: any;
  blockchainEvent: Event;
}
