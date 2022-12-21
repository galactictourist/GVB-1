import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'ethers';
import { BlockchainNetwork, BLOCKCHAIN_INFO } from '~/main/types/blockchain';
import NftAbi from './abi/nft.json';
import { BaseSmartContractService } from './base-smart-contract.service';

@Injectable()
export class NftSmartContractService extends BaseSmartContractService {
  constructor(private readonly configService: ConfigService) {
    super();
    this.abi = NftAbi;
  }

  protected getContractAddress(network: BlockchainNetwork): string {
    return BLOCKCHAIN_INFO[network].constract.erc721.address;
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
}
