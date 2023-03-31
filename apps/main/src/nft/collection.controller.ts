import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { appConfig } from '../config/app.config';
import { StorageService } from '../storage/storage.service';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FilterCollectionDto } from './dto/filter-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionStatus } from './types';

@Controller('collections')
@ApiTags('collection')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly storageService: StorageService
  ) {}

  @Public()
  @Post('_search')
  async search(
    @Body() searchCollectionDto: FilterCollectionDto,
  ): Promise<ResponseData<any[]>> {
    const collections = await this.collectionService.searchCollectionByOwners(
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
  @Get(':collection_id')
  async getCollection(
    @Param('collection_id') collectionId: string,
  ) {
    const collectionObject = await this.collectionService.searchCollectionByCollectionId(collectionId);
    return formatResponse(collectionObject);
  }

  @Public()
  @Get(':id/nfts')
  async getNftsInCollection(
    @Param('id') collectionId: string,
  ): Promise<ResponseData<any[]>> {
    const nfts = await this.collectionService.getNftsInCollection(collectionId);
    return formatResponse(nfts);
  }

  @Post('')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async createCollection(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: new RegExp('.(jpg|jpeg|png)$') }),
          new MaxFileSizeValidator({
            maxSize: appConfig().maxFileUploadSize,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() request: UserRequest,
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<ResponseData<any>> {
    const collection = await this.collectionService.createCollection(
      file,
      createCollectionDto,
      { ownerId: request.user.id, status: CollectionStatus.PUBLISHED },
      request.user,
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
