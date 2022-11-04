import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './entity/collection.entity';
import { NftEntity } from './entity/nft.entity';
import { NftController } from './nft.controller';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';
import { NftService } from './nft.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionEntity, NftEntity])],
  controllers: [NftController],
  providers: [CollectionRepository, NftRepository, NftService],
})
export class NftModule {}
