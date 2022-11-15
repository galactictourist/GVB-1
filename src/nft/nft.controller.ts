import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '~/auth/decorator/public.decorator';
import { BlockchainNetwork } from '~/types/blockchain';
import { formatResponse, ResponseData } from '~/types/response-data';
import { FilterNftDto } from './dto/filter-nft.dto';
import { NftService } from './nft.service';
import { NftStatus } from './types';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Public()
  @Post('_search')
  async search(
    @Body() searchNftDto: FilterNftDto,
  ): Promise<ResponseData<any[]>> {
    const nfts = await this.nftService.search(searchNftDto, {
      status: NftStatus.ACTIVE,
    });
    return formatResponse(nfts.data, {
      pagination: {
        total: nfts.total,
      },
    });
  }

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
