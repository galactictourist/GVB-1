import { Injectable } from '@nestjs/common';
import { BlockchainNetwork } from '~/types/blockchain';
import { NftRepository } from './repository/nft.repository';

@Injectable()
export class NftService {
  constructor(private readonly nftRepository: NftRepository) {}

  async getNftByNetworkAddressTokenId(
    network: BlockchainNetwork,
    scAddress: string,
    tokenId: string,
  ) {
    const nft = await this.nftRepository.findOneBy({
      network,
      scAddress,
      tokenId,
    });
    return nft;
  }
}
