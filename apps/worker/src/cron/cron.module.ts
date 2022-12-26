import { Module } from '@nestjs/common';
import { BlockchainModule } from '~/main/blockchain/blockchain.module';
import { CronService } from './cron.service';

@Module({
  imports: [BlockchainModule],
  controllers: [],
  providers: [CronService],
})
export class CronModule {}
