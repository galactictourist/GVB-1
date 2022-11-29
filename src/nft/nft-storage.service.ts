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

  async upload(name: string, buffer: Buffer) {
    const metadata = await this.client.store({
      name,
      description: 'Pin is not delicious beef!',

      image: new File([buffer], name, { type: 'image/jpg' }),
    });
    console.log(metadata.url, metadata);
    // TODO
  }
}
