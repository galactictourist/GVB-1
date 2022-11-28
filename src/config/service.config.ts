import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

export interface IServiceConfig {
  nftStorage: {
    key: string;
  };
}

export const serviceConfig = registerAs(
  ConfigNamespace.SERVICE,
  (): IServiceConfig => ({
    nftStorage: {
      key: process.env.SERVICE_NFT_STORAGE_API_KEY || '',
    },
  }),
);
