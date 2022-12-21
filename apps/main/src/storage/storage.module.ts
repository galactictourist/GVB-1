import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '~/main/shared/shared.module';
import { StorageEntity } from './entity/storage.entity';
import { StorageRepository } from './repository/storage.repository';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { IsStorageIdValidator } from './validator/is-storage-id.validator';

@Module({
  imports: [TypeOrmModule.forFeature([StorageEntity]), SharedModule],
  controllers: [StorageController],
  providers: [StorageService, IsStorageIdValidator, StorageRepository],
  exports: [StorageService],
})
export class StorageModule {}
