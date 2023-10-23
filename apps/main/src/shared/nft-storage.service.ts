import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File, NFTStorage } from 'nft.storage';
import { IServiceConfig } from '~/main/config/service.config';
import { ConfigNamespace } from '~/main/types/config';

@Injectable()
export class NftStorageService {
  private client: NFTStorage;

  constructor(private readonly configService: ConfigService) {
    const serviceConfig = this.configService.getOrThrow<IServiceConfig>(
      ConfigNamespace.SERVICE,
    );
    this.client = new NFTStorage({ token: serviceConfig.nftStorage.key });
  }

  async uploadMetadata(metadata: object) {
    const { cid, car } = await NFTStorage.encodeDirectory([
      new File([JSON.stringify(metadata, null, 2)], 'metadata.json'),
    ]);
    this.client.store;
    await this.client.storeCar(car);
    return cid;
  }

  async uploadFiles(files: File[]) {
    try {
      const cid = await this.client.storeDirectory(files);
      return cid;
    } catch (error) {
      console.error(error);
    }
  }
}
