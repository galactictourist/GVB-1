import { Module } from '@nestjs/common';
import { CollectionRepository } from '../nft/repository/collection.repository';
import { StorageModule } from '../storage/storage.module';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { BatchRepository } from './repository/batch.repository';

@Module({
  imports: [StorageModule],
  providers: [BatchService, BatchRepository, CollectionRepository],
  controllers: [BatchController],
  exports: [BatchService, BatchRepository, CollectionRepository],
})
export class BatchModule {}
