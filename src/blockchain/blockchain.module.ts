import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SignerService } from './signer.service';

@Module({
  imports: [ConfigModule],
  providers: [SignerService],
  exports: [SignerService],
})
export class BlockchainModule {}
