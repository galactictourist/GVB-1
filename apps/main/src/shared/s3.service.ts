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

  async uploadPublicRead(
    path: string,
    content: string | Buffer,
    contentType?: string,
  ) {
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
    return {
      storagePath,
      url: this.getPublicUrl(storagePath),
    };
  }
}
