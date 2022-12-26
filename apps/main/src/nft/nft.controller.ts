import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { CreateNftDto } from './dto/create-nft.dto';
import { SearchNftDto } from './dto/search-nft.dto';
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
    @Body() searchNftDto: SearchNftDto,
  ): Promise<ResponseData<NftEntity[]>> {
    const result = await this.nftService.search(searchNftDto, {
      status: NftStatus.ACTIVE,
    });
    return formatResponse(result.data, {
      pagination: {
        total: result.total,
        limit: result.limit,
        page: result.page,
      },
    });
  }

  @Post('_search/mine')
  @ApiBearerAuth()
  async searchMine(
    @Request() request: UserRequest,
    @Body() searchNftDto: SearchNftDto,
  ): Promise<ResponseData<NftEntity[]>> {
    const result = await this.nftService.search(searchNftDto, {
      ownerId: request.user.id,
    });
    return formatResponse(result.data, {
      pagination: {
        total: result.total,
        limit: result.limit,
        page: result.page,
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

  @Public()
  @Get(':network/:scAddress/:tokenId/metadata.json')
  async getMetadata(
    @Param('network') network: BlockchainNetwork,
    @Param('scAddress') scAddress: string,
    @Param('tokenId') tokenId: string,
  ): Promise<object> {
    const nft = await this.nftService.getNftByNetworkAddressTokenId(
      network,
      scAddress,
      tokenId,
    );
    return nft.generateMetadata();
  }

  @Post('')
  @ApiBearerAuth()
  async createNft(
    @Request() request: UserRequest,
    @Body() createNftDto: CreateNftDto,
  ): Promise<ResponseData<NftEntity>> {
    const nft = await this.nftService.createNft(
      createNftDto,
      {
        ownerId: request.user.id,
        status: NftStatus.ACTIVE,
      },
      request.user,
    );
    return formatResponse(nft);
  }

  // @Post(':id/mint')
  // @ApiBearerAuth()
  // async generateSignature(
  //   @Param('id') id: string,
  //   @Body() mintNftDto: MintNftDto,
  //   @Request() request: UserRequest,
  // ): Promise<ResponseData<object>> {
  //   const result = await this.nftService.mint(id, mintNftDto, request.user);
  //   return formatResponse({
  //     signature: result.signature,
  //     signer: result.address,
  //     data: result.data,
  //   });
  // }

  @Put(':id/immutable')
  @ApiBearerAuth()
  async setImmutable(
    @Param('id') id: string,
    @Request() request: UserRequest,
  ): Promise<ResponseData<object>> {
    const result = await this.nftService.setImmutable(id, request.user);
    return formatResponse(result);
  }

  @Put(':id')
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
