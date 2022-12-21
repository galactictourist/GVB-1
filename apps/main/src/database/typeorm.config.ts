import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'secret',
  database: process.env.POSTGRES_DATABASE || 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});
