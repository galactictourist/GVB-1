import { Module } from '@nestjs/common';
import { AlchemyNftService } from './alchemy-nft.service';
import { CountryController } from './country.controller';
import { NftStorageService } from './nft-storage.service';
import { S3Service } from './s3.service';

@Module({
  imports: [],
  providers: [NftStorageService, S3Service, AlchemyNftService],
  exports: [NftStorageService, S3Service, AlchemyNftService],
  controllers: [CountryController],
})
export class SharedModule {}
