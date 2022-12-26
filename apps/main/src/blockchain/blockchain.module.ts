import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventProcessController } from './event-process.controller';
import { EventProcessService } from './event-process.service';
import { MarketSmartContractService } from './market-smart-contracts.service';
import { NftSmartContractService } from './nft-smart-contracts.service';
import { EventProcessRepository } from './repository/event-process.repository';
import { SignerService } from './signer.service';

@Module({
  imports: [ConfigModule],
  controllers: [EventProcessController],
  providers: [
    SignerService,
    NftSmartContractService,
    MarketSmartContractService,
    EventProcessService,
    EventProcessRepository,
  ],
  exports: [
    SignerService,
    NftSmartContractService,
    MarketSmartContractService,
    EventProcessService,
  ],
})
export class BlockchainModule {}
