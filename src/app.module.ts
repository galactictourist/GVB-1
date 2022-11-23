import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { CharityModule } from './charity/charity.module';
import { configs } from './config';
import { DatabaseSeedCommand } from './database/database-seed.command';
import { DatabaseSchemaSeedCommand } from './database/schema-seed.command';
import { TypeOrmConfigService } from './database/typeorm.service';
import { NftModule } from './nft/nft.module';
import { UserModule } from './user/user.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configs }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UserModule,
    AuthModule,
    NftModule,
    CharityModule,
    MarketplaceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    DatabaseSeedCommand,
    DatabaseSchemaSeedCommand,
  ],
})
export class AppModule {}
