import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigNamespace } from '~/main/types/config';

export interface IHttpConfig {
  host: string;
  port: number;
  ssl: {
    enabled: boolean;
    key: string;
    cert: string;
  };
  corsOrigins: string | string[];
}

export const httpConfig = registerAs(ConfigNamespace.HTTP, (): IHttpConfig => {
  const httpsEnabled =
    process.env.HTTP_SSL_ENABLED === '1' ||
    process.env.HTTP_SSL_ENABLED === 'true'
      ? true
      : false;
  return {
    host: process.env.HTTP_HOST || '127.0.0.1',
    port: process.env.PORT ? +process.env.PORT : 3000,
    ssl: {
      enabled: httpsEnabled,
      key: httpsEnabled
        ? process.env.HTTP_SSL_KEY ||
          readFileSync(
            join(__dirname, '/../../secrets/https-cert/private-key.pem'),
            'utf8',
          )
        : '',
      cert: httpsEnabled
        ? process.env.HTTP_SSL_CERT ||
          readFileSync(
            join(__dirname, '/../../secrets/https-cert/public-cert.pem'),
            'utf8',
          )
        : '',
    },
    corsOrigins: process.env.HTTP_CORS_ORIGINS
      ? process.env.HTTP_CORS_ORIGINS.split(',')
      : '*',
  };
});
