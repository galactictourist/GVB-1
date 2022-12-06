import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';
import { S3Provider } from '~/types/s3-provider';

export interface IServiceConfig {
  nftStorage: {
    key: string;
  };
  s3: {
    provider: S3Provider;
    endpoint: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
  };
}

export const serviceConfig = registerAs(
  ConfigNamespace.SERVICE,
  (): IServiceConfig => ({
    nftStorage: {
      key: process.env.SERVICE_NFT_STORAGE_API_KEY || '',
    },
    s3: {
      provider: S3Provider.DIGITALOCEAN_SPACES,
      endpoint: process.env.AWS_S3_ENDPOINT || '',
      bucket: process.env.AWS_S3_BUCKET || '',
      accessKey: process.env.AWS_S3_ACCESS_KEY || '',
      secretKey: process.env.AWS_S3_SECRET_KEY || '',
    },
  }),
);
