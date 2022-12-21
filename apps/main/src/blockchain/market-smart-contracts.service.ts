import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'ethers';
import { BlockchainNetwork, BLOCKCHAIN_INFO } from '~/types/blockchain';
import MarketAbi from './abi/market.json';
import { BaseSmartContractService } from './base-smart-contract.service';

@Injectable()
export class MarketSmartContractService extends BaseSmartContractService {
  constructor(private readonly configService: ConfigService) {
    super();
    this.abi = MarketAbi;
  }

  protected getContractAddress(network: BlockchainNetwork): string {
    return BLOCKCHAIN_INFO[network].constract.marketplace.address;
  }

  async getNonce(network: BlockchainNetwork, address: string) {
    const contract = this.getContract(
      network,
      this.getContractAddress(network),
    );
    const nonce: BigNumber = await this.read(contract, 'nonces', [address]);
    return nonce;
  }
}
