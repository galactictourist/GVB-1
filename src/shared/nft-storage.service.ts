import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File, NFTStorage } from 'nft.storage';
import { IServiceConfig } from '~/config/service.config';
import { ConfigNamespace } from '~/types/config';

@Injectable()
export class NftStorageService {
  private client: NFTStorage;

  constructor(private readonly configService: ConfigService) {
    const serviceConfig = this.configService.getOrThrow<IServiceConfig>(
      ConfigNamespace.SERVICE,
    );
    this.client = new NFTStorage({ token: serviceConfig.nftStorage.key });
  }

  async upload(metadata: object) {
    const { cid, car } = await NFTStorage.encodeDirectory([
      new File([JSON.stringify(metadata, null, 2)], 'metadata.json'),
    ]);
    await this.client.storeCar(car);
    return cid;
  }
}
