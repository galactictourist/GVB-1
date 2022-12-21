import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from '~/main/blockchain/blockchain.module';
import { SharedModule } from '~/main/shared/shared.module';
import { StorageModule } from '~/main/storage/storage.module';
import { UserModule } from '~/main/user/user.module';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionEntity } from './entity/collection.entity';
import { NftEntity } from './entity/nft.entity';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionEntity, NftEntity]),
    SharedModule,
    UserModule,
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
