import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { UserService } from '~/user/user.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionEntity } from './entity/collection.entity';
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

  async createCollection(
    createCollectionDto: CreateCollectionDto,
    additions: DeepPartial<CollectionEntity>,
  ) {
    const collectionEntity = this.collectionRepository.create({
      ...additions,
      name: createCollectionDto.name,
      description: createCollectionDto.description,
    });

    await collectionEntity.save();
    console.log('collectionEntity', collectionEntity);
    return collectionEntity;
  }

  async getPublishedCollectionByUserId(userId: string) {
    const user = await this.userService.findOneById(userId);
    if (user) {
      const [data, total] = await this.collectionRepository.findAndCountBy({
        ownerId: user.id,
        status: CollectionStatus.PUBLISHED,
      });
      return { data, total };
    }
    return { data: [], total: 0 };
  }

  async getNftsInCollection(collectionId: string) {
    const collection = await this.collectionRepository.findOneBy({
      id: collectionId,
    });
    if (collection) {
      if (collection.status === CollectionStatus.PUBLISHED) {
        const [data, total] = await this.nftRepository.findAndCountBy({
          collectionId: collection.id,
        });
        return { data, total };
      }
    }
    return { data: [], total: 0 };
  }
}
