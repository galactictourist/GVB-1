import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

export interface IBlockchainConfig {
  placeholder: boolean;
}

export const blockchainConfig = registerAs(
  ConfigNamespace.BLOCKCHAIN,
  (): IBlockchainConfig => ({
    placeholder: true,
  }),
);
