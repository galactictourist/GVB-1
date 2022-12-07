import { Injectable } from '@nestjs/common';
import { S3Service } from '~/shared/s3.service';
import { NftStorageService } from '../shared/nft-storage.service';
import { NftRepository } from './repository/nft.repository';

@Injectable()
export class ImageService {
  constructor(
    private readonly nftRepository: NftRepository,
    private readonly nftStorageService: NftStorageService,
    private readonly s3Service: S3Service,
  ) {}

  async upload(name: string, buffer: Buffer) {
    // const url = await this.s3Service.upload(name, buffer);
    // return this.nftStorageService.upload(name, buffer);
    // TODO
  }
}
