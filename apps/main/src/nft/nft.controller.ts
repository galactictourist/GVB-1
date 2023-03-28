import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { CreateNftDto } from './dto/create-nft.dto';
import { ImportNftsDto } from './dto/import-nfts.dto';
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
  @Post('import')
  async immportNftTest(
    @Body() importNftsDto: ImportNftsDto,
  ): Promise<ResponseData<any>> {
    if (!importNftsDto.owner) {
      throw new BadRequestException('Missing owner');
    }

    const result = await this.nftService.importNfts(
      importNftsDto,
      importNftsDto.owner,
    );
    return formatResponse(result);
  }

  @Post('import/mine')
  @ApiBearerAuth()
  async immportNft(
    @Request() request: UserRequest,
    @Body() importNftsDto: ImportNftsDto,
  ): Promise<ResponseData<any>> {
    if (!request.user.wallet) {
      throw new BadRequestException();
    }

    const result = await this.nftService.importNfts(
      importNftsDto,
      request.user.wallet,
    );
    return formatResponse(result);
  }

  @Public()
  @Get(':network/:scAddress/:tokenId')
  async getPublishedCollectionByWallet(
    @Param('network') network: string,
    @Param('scAddress') scAddress: string,
    @Param('tokenId') tokenId: string,
  ): Promise<ResponseData<NftEntity>> {
    const nft = await this.nftService.getNftByNetworkAddressTokenId(
      network as BlockchainNetwork,
      scAddress,
      Number(tokenId),
    );
    return formatResponse(nft);
  }

  @Public()
  @Get(':network/:scAddress/:tokenId/metadata.json')
  async getMetadata(
    @Param('network') network: string,
    @Param('scAddress') scAddress: string,
    @Param('tokenId') tokenId: string,
  ): Promise<Record<string, unknown>> {
    const nft = await this.nftService.getNftByNetworkAddressTokenId(
      network as BlockchainNetwork,
      scAddress,
      Number(tokenId),
    );
    return nft.generateMetadata();
  }

  @Public()
  @Get(':nftId/metadata.json')
  async getMetadataByNftId(
    @Param('nftId') nftId: string,
  ): Promise<Record<string, unknown>> {
    const nft = await this.nftService.findById(nftId);
    if (nft) {
      return nft.generateMetadata();
    }
    throw new NotFoundException();
  }

  @Public()
  @Get(':nftId')
  async getNft(
    @Param('nftId') nftId: string,
  ): Promise<ResponseData<NftEntity>> {
    const nft = await this.nftService.findById(
      nftId, 
      {
        relations: { owner: true, collection: true, sales: true},
      }
    );
    if (!nft) {
      throw new NotFoundException();
    }
    return formatResponse(nft);
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
