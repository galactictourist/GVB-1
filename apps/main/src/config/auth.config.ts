import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

export interface IAuthConfig {
  signIn: {
    nonceTtl: number;
  };
}

export const authConfig = registerAs(
  ConfigNamespace.AUTH,
  (): IAuthConfig => ({
    signIn: {
      nonceTtl: 60,
    },
  }),
);
