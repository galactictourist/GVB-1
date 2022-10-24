import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const databaseConfig = registerAs(
  ConfigNamespace.DATABASE,
  (): IDatabaseConfig => ({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'secret',
    database: process.env.POSTGRES_DATABASE || 'postgres',
  }),
);
