import { Module } from '@nestjs/common';
import { BlockchainModule } from '~/main/blockchain/blockchain.module';
import { MarketplaceModule } from '~/main/marketplace/marketplace.module';
import { NftModule } from '~/main/nft/nft.module';
import { CronService } from './cron.service';

@Module({
  imports: [BlockchainModule, NftModule, MarketplaceModule],
  controllers: [],
  providers: [CronService],
})
export class CronModule {}
