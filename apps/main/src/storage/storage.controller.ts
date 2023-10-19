import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ResponseData, formatResponse } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { JwtAdminAuthGuard } from '../auth/guard/jwt-admin-auth.guard';
import { appConfig } from '../config/app.config';
import { UploadCollectionImageDto } from './dto/upload-collection-image.dto';
import { UploadNftImageDto } from './dto/upload-nft-image.dto';
import { StorageEntity } from './entity/storage.entity';
import { StorageService } from './storage.service';
import { StorageLabel } from './types';

@Controller('storage')
@ApiTags('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('nft/images')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadImages(
    @UploadedFiles() rawFiles: Array<Express.Multer.File>,
    @Request() request: UserRequest,
  ) {
    const storage = await this.storageService.storePublicFiles(rawFiles, {
      ownerId: request.user.id,
      label: StorageLabel.NFT_IMAGE,
    });
    return formatResponse(storage);
  }

  @Post('nft/image')
  @UseGuards(JwtAdminAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadNftImageDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadNftImage(
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
  ): Promise<ResponseData<StorageEntity>> {
    const storage = await this.storageService.storePublicReadFile(file, {
      ownerId: request.user.id,
      label: StorageLabel.NFT_IMAGE,
    });
    return formatResponse(storage);
  }

  @Post('collection/image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadCollectionImageDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCollectionImage(
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
  ): Promise<ResponseData<StorageEntity>> {
    const storage = await this.storageService.storePublicReadFile(file, {
      ownerId: request.user.id,
      label: StorageLabel.COLLECTION_IMAGE,
    });
    return formatResponse(storage);
  }

  @Post('profile/image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadNftImageDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
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
  ): Promise<ResponseData<StorageEntity>> {
    const storage = await this.storageService.storePublicReadFile(file, {
      ownerId: request.user.id,
      label: StorageLabel.PROFILE_IMAGE,
    });
    return formatResponse(storage);
  }
}
