import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/main/types/config';

export interface IBlockchainConfig {
  verifier: {
    pk: string;
  };
  eventFetchingMaxBlock: number;
}

export const blockchainConfig = registerAs(
  ConfigNamespace.BLOCKCHAIN,
  (): IBlockchainConfig => ({
    verifier: {
      pk: process.env.VERIFIER_PK || '',
    },
    eventFetchingMaxBlock: process.env.EVENT_FETCHING_MAX_BLOCKS
      ? +process.env.EVENT_FETCHING_MAX_BLOCKS
      : 1000,
  }),
);
