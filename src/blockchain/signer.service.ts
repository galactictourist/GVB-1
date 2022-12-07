import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypedDataDomain, Wallet } from 'ethers';
import { IBlockchainConfig } from '~/config/blockchain.config';
import { BlockchainNetwork, BLOCKCHAIN_INFO } from '~/types/blockchain';
import { ConfigNamespace } from '~/types/config';
import { AddSingleItem, BuyItem } from './types';

@Injectable()
export class SignerService {
  constructor(private readonly configService: ConfigService) {}

  private async signMarket(
    network: BlockchainNetwork,
    data: Record<string, any>,
  ) {
    const blockchainConfig = this.configService.getOrThrow<IBlockchainConfig>(
      ConfigNamespace.BLOCKCHAIN,
    );
    const wallet = new Wallet(blockchainConfig.verifier.pk);

    const domain: TypedDataDomain = {
      name: BLOCKCHAIN_INFO[network].constract.erc721.name,
      version: '1',
      chainId: BLOCKCHAIN_INFO[network].chainId,
      verifyingContract: BLOCKCHAIN_INFO[network].constract.erc721.address,
    };

    const signature = await wallet._signTypedData(
      domain,
      BLOCKCHAIN_INFO[network].constract.marketplace.types || {},
      data,
    );
    return signature;
  }

  async signForMinting(network: BlockchainNetwork, data: AddSingleItem) {
    return this.signMarket(network, data);
  }

  async signForBuying(network: BlockchainNetwork, data: BuyItem) {
    return this.signMarket(network, data);
  }
}
