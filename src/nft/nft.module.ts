import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './entity/collection.entity';
import { NftEntity } from './entity/nft.entity';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionEntity, NftEntity])],
  controllers: [NftController],
  providers: [CollectionRepository, NftRepository, NftService],
  exports: [CollectionRepository, NftRepository, NftService],
})
export class NftModule {}
