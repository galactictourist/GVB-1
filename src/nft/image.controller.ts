import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '~/types/user-request';
import { UploadImageDto } from './dto/upload-image.dto';
import { ImageService } from './image.service';

const multerOptions: MulterOptions = {
  fileFilter: (
    req: UserRequest,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};

@Controller('nfts')
@ApiTags('nft')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadImageDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() data: UploadImageDto,
    @UploadedFile() file: Express.Multer.File,
  ): void {
    data.file = file;
    console.log({ data, file });
    // await this.imageService.upload(file.originalname, file.buffer);
    // const response = {
    //   originalname: file.originalname,
    //   filename: file.filename,
    // };
    // return response;
  }
}
