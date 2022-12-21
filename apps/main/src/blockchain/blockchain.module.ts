import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MarketSmartContractService } from './market-smart-contracts.service';
import { NftSmartContractService } from './nft-smart-contracts.service';
import { SignerService } from './signer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    SignerService,
    NftSmartContractService,
    MarketSmartContractService,
  ],
  exports: [SignerService, NftSmartContractService, MarketSmartContractService],
})
export class BlockchainModule {}
