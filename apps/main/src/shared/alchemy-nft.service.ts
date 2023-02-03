import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Alchemy, OwnedNftsResponse } from 'alchemy-sdk';
import { IServiceConfig } from '~/main/config/service.config';
import { ConfigNamespace } from '~/main/types/config';
import { BlockchainNetwork, getNetworkConfig } from '../types/blockchain';

@Injectable()
export class AlchemyNftService {
  private apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const serviceConfig = this.configService.getOrThrow<IServiceConfig>(
      ConfigNamespace.SERVICE,
    );
    this.apiKey = serviceConfig.alchemy.apiKey;
  }

  private getAlchemyInstance(network: BlockchainNetwork) {
    const blockchainConfig = getNetworkConfig(network);
    if (!blockchainConfig.alchemyNetwork) {
      throw new Error('Network does not support');
    }

    const alchemy = new Alchemy({
      apiKey: this.apiKey,
      network: blockchainConfig.alchemyNetwork,
    });
    return alchemy;
  }

  async getNftsForOwnerByContractAddress(
    network: BlockchainNetwork,
    owner: string,
    nftAddress: string,
    cb?: (nfts: OwnedNftsResponse) => Promise<boolean | unknown>,
    pageSize = 100,
  ): Promise<void> {
    const alchemy = this.getAlchemyInstance(network);
    let pageKey;
    do {
      const nfts: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(owner, {
        pageKey,
        contractAddresses: [nftAddress],
        pageSize,
      });

      if (cb) {
        const result = await cb(nfts);
        if (result === false) {
          break;
        }
      }
      pageKey = nfts.pageKey;
    } while (pageKey);
  }
}
