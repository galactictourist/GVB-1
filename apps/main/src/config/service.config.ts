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
    publicUrlPrefix: string;
    region: string;
    accessKey: string;
    secretKey: string;
    pathPrefix: string;
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
      publicUrlPrefix: process.env.AWS_S3_PUBLIC_URL_PREFIX || '',
      bucket: process.env.AWS_S3_BUCKET || '',
      region: process.env.AWS_S3_REGION || '',
      accessKey: process.env.AWS_S3_ACCESS_KEY || '',
      secretKey: process.env.AWS_S3_SECRET_KEY || '',
      pathPrefix: process.env.AWS_S3_PATH_PREFIX || '',
    },
  }),
);
