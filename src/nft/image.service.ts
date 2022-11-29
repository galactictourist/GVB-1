import { Injectable } from '@nestjs/common';
import { NftStorageService } from './nft-storage.service';
import { NftRepository } from './repository/nft.repository';

@Injectable()
export class ImageService {
  constructor(
    private readonly nftRepository: NftRepository,
    private readonly nftStorageService: NftStorageService,
  ) {}

  async upload(name: string, buffer: Buffer) {
    return this.nftStorageService.upload(name, buffer);
    // TODO
  }
}
