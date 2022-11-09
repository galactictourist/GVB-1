import { appConfig } from './app.config';
import { authConfig } from './auth.config';
import { blockchainConfig } from './blockchain.config';
import { databaseConfig } from './database.config';
import { httpConfig } from './http.config';
import { jwtConfig } from './jwt.config';
import { swaggerConfig } from './swagger.config';

export const configs = [
  appConfig,
  httpConfig,
  swaggerConfig,
  databaseConfig,
  jwtConfig,
  authConfig,
  blockchainConfig,
];
