import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

type Logging = 'file' | 'debug';

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logging?: Logging;
}

export const databaseConfig = registerAs(
  ConfigNamespace.DATABASE,
  (): IDatabaseConfig => ({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'secret',
    database: process.env.POSTGRES_DATABASE || 'postgres',
    logging: process.env.DB_LOGGING as Logging,
  }),
);
