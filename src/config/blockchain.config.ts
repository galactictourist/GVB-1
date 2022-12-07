import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

export interface IBlockchainConfig {
  verifier: {
    pk: string;
  };
}

export const blockchainConfig = registerAs(
  ConfigNamespace.BLOCKCHAIN,
  (): IBlockchainConfig => ({
    verifier: {
      pk: process.env.VERIFIER_PK || '',
    },
  }),
);
