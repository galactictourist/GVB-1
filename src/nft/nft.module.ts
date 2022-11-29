import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '~/user/user.module';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionEntity } from './entity/collection.entity';
import { NftEntity } from './entity/nft.entity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { NftStorageService } from './nft-storage.service';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionEntity, NftEntity]),
    UserModule,
  ],
  controllers: [ImageController, NftController, CollectionController],
  providers: [
    CollectionRepository,
    NftRepository,
    NftService,
    CollectionService,
    NftStorageService,
    ImageService,
  ],
  exports: [CollectionRepository, NftRepository, NftService, CollectionService],
})
export class NftModule {}
