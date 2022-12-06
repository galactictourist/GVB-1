import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NFTStorage } from 'nft.storage';
import { IServiceConfig } from '~/config/service.config';
import { ConfigNamespace } from '~/types/config';

@Injectable()
export class S3Service {
  private client: NFTStorage;

  constructor(private readonly configService: ConfigService) {
    const serviceConfig = this.configService.getOrThrow<IServiceConfig>(
      ConfigNamespace.SERVICE,
    );
    this.client = new NFTStorage({ token: serviceConfig.nftStorage.key });
  }

  async upload(name: string, buffer: Buffer) {
    // const params = {
    //   Bucket: "example-space", // The path to the directory you want to upload the object to, starting with your Space name.
    //   Key: "folder-path/hello-world.txt", // Object key, referenced whenever you want to access this file later.
    //   Body: "Hello, World!", // The object's contents. This variable is an object, not a string.
    //   ACL: "private", // Defines ACL permissions, such as private or public.
    //   Metadata: { // Defines metadata tags.
    //     "x-amz-meta-my-key": "your-value"
    //   }
    // };
    // const uploadObject = async () => {
    //   try {
    //     const data = await s3Client.send(new PutObjectCommand(params));
    //     console.log(
    //       "Successfully uploaded object: " +
    //         params.Bucket +
    //         "/" +
    //         params.Key
    //     );
    //     return data;
    //   } catch (err) {
    //     console.log("Error", err);
    //   }
    // };
    // TODO
  }
}
