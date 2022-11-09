import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

export interface IHttpConfig {
  host: string;
  port: number;
  corsOrigins: string[];
}

export const httpConfig = registerAs(
  ConfigNamespace.HTTP,
  (): IHttpConfig => ({
    port: process.env.PORT ? +process.env.PORT : 3000,
    host: process.env.HTTP_HOST || '127.0.0.1',
    corsOrigins: process.env.HTTP_CORS_ORIGINS
      ? process.env.HTTP_CORS_ORIGINS.split(',')
      : [],
  }),
);
