import { Module } from '@nestjs/common';
import { SharedModule } from '~/main/shared/shared.module';
import { StorageRepository } from './repository/storage.repository';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { IsStorageIdValidator } from './validator/is-storage-id.validator';

@Module({
  imports: [SharedModule],
  controllers: [StorageController],
  providers: [StorageService, IsStorageIdValidator, StorageRepository],
  exports: [StorageService],
})
export class StorageModule {}
