import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '~/auth/decorator/public.decorator';
import { BlockchainNetwork } from '~/types/blockchain';
import { formatResponse } from '~/types/response-data';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Public()
  @Get(':network/:scAddress/:tokenId')
  async getPublishedCollectionByWallet(
    @Param('network') network: BlockchainNetwork,
    @Param('scAddress') scAddress: string,
    @Param('tokenId') tokenId: string,
  ) {
    const nft = await this.nftService.getNftByNetworkAddressTokenId(
      network,
      scAddress,
      tokenId,
    );
    return formatResponse(nft);
  }
}
