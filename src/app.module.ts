import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { BlockchainModule } from './blockchain/blockchain.module';
import { CharityModule } from './charity/charity.module';
import { configs } from './config';
import { DatabaseSeedCommand } from './database/database-seed.command';
import { TypeOrmConfigService } from './database/typeorm.service';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { NftModule } from './nft/nft.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configs }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UserModule,
    AuthModule,
    NftModule,
    CharityModule,
    MarketplaceModule,
    SharedModule,
    BlockchainModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    DatabaseSeedCommand,
  ],
})
export class AppModule {}
