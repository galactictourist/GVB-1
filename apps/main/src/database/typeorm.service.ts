import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { IDatabaseConfig } from '~/config/database.config';
import { ConfigNamespace } from '~/types/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseConfig = this.configService.getOrThrow<IDatabaseConfig>(
      ConfigNamespace.DATABASE,
    );
    return {
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*.{ts,js}'],
      logger: databaseConfig.logging,
    };
  }
}
