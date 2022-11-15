import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { UserService } from '~/user/user.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FilterCollectionDto } from './dto/filter-collection.dto';
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
    defaults: DeepPartial<CollectionEntity>,
  ) {
    const collectionEntity = this.collectionRepository.create({
      ...defaults,
      name: createCollectionDto.name,
      description: createCollectionDto.description,
    });

    await collectionEntity.save();
    console.log('collectionEntity', collectionEntity);
    return collectionEntity;
  }

  async search(
    searchCollectionDto: FilterCollectionDto,
    defaults: FindOptionsWhere<CollectionEntity>,
  ) {
    const where: FindOptionsWhere<CollectionEntity> = {
      ...defaults,
    };
    if (searchCollectionDto.ownerIds && searchCollectionDto.ownerIds.length) {
      where.ownerId = In(searchCollectionDto.ownerIds);
    }
    console.log('where', where);

    const [data, total] = await this.collectionRepository.findAndCountBy(where);
    return { data, total };
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
