import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, Event } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import {
  BlockchainNetwork,
  getMarketplaceSmartContract
} from '~/main/types/blockchain';
import MarketAbi from "./abi/market.json";
import { BaseSmartContractService } from './base-smart-contract.service';
import {
  OrderCompletedEvent,
  OrderCompletedEventV1,
  SaleCancelledEvent
} from './types/event';

@Injectable()
export class MarketSmartContractService extends BaseSmartContractService {
  constructor(private readonly configService: ConfigService) {
    super();
    this.abi = new Interface(MarketAbi);
  }

  protected getContractAddress(network: BlockchainNetwork): string {
    return getMarketplaceSmartContract(network).address;
  }

  async getNonce(network: BlockchainNetwork, address: string) {
    const contract = this.getContract(
      network,
      this.getContractAddress(network),
    );
    const nonce: BigNumber = await this.read(contract, 'nonces', [address]);
    return nonce;
  }

  async getSaleCancelledEvents(
    network: BlockchainNetwork,
    fromBlock: number,
    toBlock: number,
  ) {
    const contract = this.getContract(
      network,
      this.getContractAddress(network),
    );
    const events = await contract.queryFilter(
      'OrderCancelled',
      fromBlock,
      toBlock,
    );
    return events.map((e) => this.formatSaleCancelledEvent(e));
  }

  private formatSaleCancelledEvent(event: any): SaleCancelledEvent {
    return {
      cancelResults: event.args.cancelResults,
      cancelStatus: event.args.cancelStatus,
      ordersHash: event.args.ordersHash,
      blockchainEvent: event,
    };
  }

  async getOrderCompletedEvents(
    network: BlockchainNetwork,
    fromBlock: number,
    toBlock: number,
  ) {
    const contract = this.getContract(
      network,
      this.getContractAddress(network),
    );
    const events = await contract.queryFilter('BoughtItem', fromBlock, toBlock);
    return events.map((e) => this.formatOrderCompletedEvent(e));
  }

  private formatOrderCompletedEventV1(event: Event): OrderCompletedEventV1 {
    const parsedEvent = this.abi.parseLog(event);
    return {
      order: parsedEvent.args.item,
      hash: parsedEvent.args.orderHash,
      blockchainEvent: event,
    };
  }

  private formatOrderCompletedEvent(event: any): OrderCompletedEvent {
    console.log(JSON.stringify(event, null, 2));
    // const parsedEvent = this.abi.parseLog(event);
    return {
      ordersHash: event.args.ordersHash,
      ordersResult: event.args.ordersResult,
      ordersStatus: event.args.ordersStatus,
      blockchainEvent: event,
    };
  }
}
