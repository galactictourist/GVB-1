import { Injectable } from '@nestjs/common';
import { Batch } from '../marketplace/types/sale-data';
import { BatchRepository } from './repository/batch.repository';

@Injectable()
export class BatchService {
  constructor(private readonly batchRepository: BatchRepository) {}

  async getBatchList(collectionId: string) {
    const data = await this.batchRepository.find({
      where: {
        collectionId: collectionId,
      },
      relations: ['nfts', 'nfts.nft'],
    });

    return data;
  }

  async createBatches(batch: Batch) {
    const batchEntity = this.batchRepository.create({
      collectionId: batch.collectionId,
      charityId: batch.charityId,
      charityShare: batch.charityShare,
    });
    await batchEntity.save();
    return batchEntity;
  }
}
