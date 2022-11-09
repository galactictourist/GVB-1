import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '~/auth/decorator/public.decorator';
import { formatResponse, ResponseData } from '~/types/response-data';
import { CollectionService } from './collection.service';

@Controller('collection')
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
}
