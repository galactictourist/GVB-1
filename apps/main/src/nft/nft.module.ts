import { Module } from '@nestjs/common';
import { BlockchainModule } from '~/main/blockchain/blockchain.module';
import { SharedModule } from '~/main/shared/shared.module';
import { StorageModule } from '~/main/storage/storage.module';
import { UserModule } from '~/main/user/user.module';
import { CharityModule } from '../charity/charity.module';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';

@Module({
  imports: [
    SharedModule,
    UserModule,
    CharityModule,
    BlockchainModule,
    StorageModule,
  ],
  controllers: [NftController, CollectionController],
  providers: [
    CollectionRepository,
    NftRepository,
    NftService,
    CollectionService,
  ],
  exports: [CollectionRepository, NftRepository, NftService, CollectionService],
})
export class NftModule {}
