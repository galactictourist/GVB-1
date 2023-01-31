import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/main/types/config';
import { S3Provider } from '~/main/types/s3-provider';

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
      endpoint:
        process.env.AWS_S3_ENDPOINT || 'https://sgp1.digitaloceanspaces.com',
      publicUrlPrefix:
        process.env.AWS_S3_PUBLIC_URL_PREFIX ||
        'https://demo.sgp1.digitaloceanspaces.com',
      bucket: process.env.AWS_S3_BUCKET || 'demo',
      region: process.env.AWS_S3_REGION || 'sgp1',
      accessKey: process.env.AWS_S3_ACCESS_KEY || 'demo_key',
      secretKey: process.env.AWS_S3_SECRET_KEY || 'demo_secret_key',
      pathPrefix: process.env.AWS_S3_PATH_PREFIX || 'demo/media',
    },
  }),
);
