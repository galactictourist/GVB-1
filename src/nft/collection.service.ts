import { Injectable } from '@nestjs/common';
import { UserService } from '~/user/user.service';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';
import { CollectionStatus } from './types';

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly userService: UserService,
    private readonly nftRepository: NftRepository,
  ) {}

  async getPublishedCollectionByUserId(userId: string) {
    const user = await this.userService.findOneById(userId);
    if (user) {
      const collections = await this.collectionRepository.find({
        where: { ownerId: user.id, status: CollectionStatus.PUBLISHED },
      });
      return collections;
    }
    return [];
  }

  async getNftsInCollection(collectionId: string) {
    const collection = await this.collectionRepository.findOneBy({
      id: collectionId,
    });
    if (collection) {
      if (collection.status === CollectionStatus.PUBLISHED) {
        const nfts = await this.nftRepository.findBy({
          collectionId: collection.id,
        });
        return nfts;
      }
    }
    return [];
  }
}
