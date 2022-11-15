import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { Public } from '~/auth/decorator/public.decorator';
import { UserRequest } from '~/types/request';
import { formatResponse, ResponseData } from '~/types/response-data';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionStatus } from './types';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Public()
  @Get('user/:userId')
  async getPublishedCollectionByWallet(
    @Param('userId') userId: string,
  ): Promise<ResponseData<any[]>> {
    const collections =
      await this.collectionService.getPublishedCollectionByUserId(userId);
    return formatResponse(collections.data);
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
}
