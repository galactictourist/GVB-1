import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/auth/decorator/public.decorator';
import { BlockchainNetwork } from '~/types/blockchain';
import { formatResponse, ResponseData } from '~/types/response-data';
import { UserRequest } from '~/types/user-request';
import { CreateNftDto } from './dto/create-nft.dto';
import { FilterNftDto } from './dto/filter-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftEntity } from './entity/nft.entity';
import { NftService } from './nft.service';
import { NftStatus } from './types';

@Controller('nfts')
@ApiTags('nft')
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
  ): Promise<ResponseData<NftEntity>> {
    const nft = await this.nftService.getNftByNetworkAddressTokenId(
      network,
      scAddress,
      tokenId,
    );
    return formatResponse(nft);
  }

  @Post('')
  @ApiBearerAuth()
  async createNft(
    @Request() request: UserRequest,
    @Body() createNftDto: CreateNftDto,
  ): Promise<ResponseData<NftEntity>> {
    const nft = await this.nftService.createNft(createNftDto, {
      ownerId: request.user.id,
      status: NftStatus.ACTIVE,
    });
    return formatResponse(nft);
  }

  @Post(':id')
  @ApiBearerAuth()
  async updateNft(
    @Param('id') id: string,
    @Request() request: UserRequest,
    @Body() updateNftDto: UpdateNftDto,
  ): Promise<ResponseData<NftEntity>> {
    const nft = await this.nftService.updateNft(id, updateNftDto, request.user);
    return formatResponse(nft);
  }
}
