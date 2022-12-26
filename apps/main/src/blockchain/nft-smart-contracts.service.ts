import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, Event } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import {
  BlockchainNetwork,
  getErc721SmartContract,
} from '~/main/types/blockchain';
import NftAbi from './abi/nft.json';
import { BaseSmartContractService } from './base-smart-contract.service';
import { Erc721TransferEvent } from './types/event';

@Injectable()
export class NftSmartContractService extends BaseSmartContractService {
  constructor(private readonly configService: ConfigService) {
    super();
    this.abi = new Interface(NftAbi);
  }

  protected getContractAddress(network: BlockchainNetwork): string {
    return getErc721SmartContract(network).address;
  }

  async balanceOf(network: BlockchainNetwork, address: string) {
    const contract = this.getContract(
      network,
      this.getContractAddress(network),
    );
    const balance: BigNumber = await this.read(contract, 'balanceOf', [
      address,
    ]);
    return balance;
  }

  async getTransferEvents(
    network: BlockchainNetwork,
    fromBlock: number,
    toBlock: number,
  ): Promise<Erc721TransferEvent[]> {
    // Transfer
    const contract = this.getContract(
      network,
      this.getContractAddress(network),
    );
    const events: Event[] = await contract.queryFilter(
      'Transfer',
      fromBlock,
      toBlock,
    );
    return events.map((e) => this.formatTransferEvent(e));
  }

  private formatTransferEvent(event: Event): Erc721TransferEvent {
    const parsedEvent = this.abi.parseLog(event);
    return {
      from: parsedEvent.args.from,
      to: parsedEvent.args.to,
      tokenId: parsedEvent.args.tokenId.toString(),
      blockchainEvent: event,
    };
  }
}
