import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/main/types/config';

export interface ISwaggerConfig {
  enabled: boolean;
  path: string;
  title: string;
}

export const swaggerConfig = registerAs(
  ConfigNamespace.SWAGGER,
  (): ISwaggerConfig => ({
    enabled:
      process.env.SWAGGER_ENABLED === '1' ||
      process.env.SWAGGER_ENABLED === 'true'
        ? true
        : false,
    path: process.env.SWAGGER_PATH || 'swagger',
    title: process.env.SWAGGER_TITLE || 'API definition',
  }),
);
