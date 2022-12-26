import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventProcessEntity } from './entity/event-process.entity';
import { EventProcessController } from './event-process.controller';
import { EventProcessService } from './event-process.service';
import { MarketSmartContractService } from './market-smart-contracts.service';
import { NftSmartContractService } from './nft-smart-contracts.service';
import { EventProcessRepository } from './repository/event-process.repository';
import { SignerService } from './signer.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([EventProcessEntity])],
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
