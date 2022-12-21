import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { NftStorageService } from './nft-storage.service';
import { S3Service } from './s3.service';

@Module({
  imports: [],
  providers: [NftStorageService, S3Service],
  exports: [NftStorageService, S3Service],
  controllers: [CountryController],
})
export class SharedModule {}
