import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '~/auth/decorator/public.decorator';
import { formatResponse, ResponseData } from '~/types/response-data';
import { UserRequest } from '~/types/user-request';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FilterCollectionDto } from './dto/filter-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionStatus } from './types';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Public()
  @Post('_search')
  async search(
    @Body() searchCollectionDto: FilterCollectionDto,
  ): Promise<ResponseData<any[]>> {
    const collections = await this.collectionService.search(
      searchCollectionDto,
      { status: CollectionStatus.PUBLISHED },
    );
    return formatResponse(collections.data, {
      pagination: {
        total: collections.total,
      },
    });
  }

  @Public()
  @Get(':id/nfts')
  async getNftsInCollection(
    @Param('id') collectionId: string,
  ): Promise<ResponseData<any[]>> {
    const nfts = await this.collectionService.getNftsInCollection(collectionId);
    return formatResponse(nfts.data);
  }

  @Post('')
  @ApiBearerAuth()
  async createCollection(
    @Request() request: UserRequest,
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<ResponseData<any>> {
    const collection = await this.collectionService.createCollection(
      createCollectionDto,
      { ownerId: request.user.id, status: CollectionStatus.PUBLISHED },
    );
    return formatResponse(collection);
  }

  @Put(':id')
  @ApiBearerAuth()
  async updateCollection(
    @Param('id') collectionId: string,
    @Request() request: UserRequest,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ): Promise<ResponseData<any>> {
    const collection = await this.collectionService.updateCollection(
      collectionId,
      updateCollectionDto,
      request.user,
    );
    return formatResponse(collection);
  }
}
