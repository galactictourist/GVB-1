import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mime from 'mime-types';
import { IServiceConfig } from '~/config/service.config';
import { ConfigNamespace } from '~/types/config';
@Injectable()
export class S3Service {
  private client: S3Client;
  private defaultParams: any;
  private pathPrefix: string;
  private bucket: string;
  private publicUrlPrefix: string;

  constructor(private readonly configService: ConfigService) {
    const serviceConfig = this.configService.getOrThrow<IServiceConfig>(
      ConfigNamespace.SERVICE,
    );
    this.client = new S3Client({
      endpoint: serviceConfig.s3.endpoint,
      forcePathStyle: false,
      region: serviceConfig.s3.region,
      credentials: {
        accessKeyId: serviceConfig.s3.accessKey,
        secretAccessKey: serviceConfig.s3.secretKey,
      },
    });
    this.pathPrefix = serviceConfig.s3.pathPrefix;
    this.bucket = serviceConfig.s3.bucket;
    this.publicUrlPrefix = serviceConfig.s3.publicUrlPrefix;

    this.defaultParams = {
      Bucket: this.bucket, // The path to the directory you want to upload the object to, starting with your Space name.
    };
  }

  getStoragePath(path: string) {
    return (this.pathPrefix ? this.pathPrefix + '/' : '') + path;
  }

  getPublicUrl(path: string) {
    return this.publicUrlPrefix + '/' + path;
  }

  async uploadPublicRead(path: string, content: any, contentType?: string) {
    try {
      const storagePath = this.getStoragePath(path);
      await this.client.send(
        new PutObjectCommand({
          ...this.defaultParams,
          ACL: 'public-read',
          Key: storagePath,
          Body: content,
          ContentType: contentType || mime.contentType(path),
        }),
      );
      return this.getPublicUrl(storagePath);
    } catch (err) {
      console.log('Error', err);
    }

    // // Step 5: Call the uploadObject function.
    // uploadObject();

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
