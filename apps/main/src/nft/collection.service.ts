import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { ContextUser } from '~/main/types/user-request';
import { StorageService } from '../storage/storage.service';
import { StorageLabel } from '../storage/types';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FilterCollectionDto } from './dto/filter-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionEntity } from './entity/collection.entity';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';
import { CollectionStatus } from './types';

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly storageService: StorageService,
    private readonly nftRepository: NftRepository,
  ) {}

  async createCollection(
    createCollectionDto: CreateCollectionDto,
    defaults: DeepPartial<CollectionEntity>,
    user: ContextUser,
  ) {
    let imageUrl: string | undefined;
    if (createCollectionDto.imageStorageId) {
      try {
        const storage = await this.storageService.getStorage({
          id: createCollectionDto.imageStorageId,
          ownerId: user.id,
          label: StorageLabel.COLLECTION_IMAGE,
        });
        imageUrl = storage.url;
      } catch (e) {
        throw new BadRequestException('Invalid file');
      }
    }

    const collectionEntity = this.collectionRepository.create({
      ...defaults,
      name: createCollectionDto.name,
      description: createCollectionDto.description,
      imageStorageId: createCollectionDto.imageStorageId,
      imageUrl,
    });

    await collectionEntity.save();
    console.log('collectionEntity', collectionEntity);
    return collectionEntity;
  }

  async updateCollection(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
    user: ContextUser,
  ) {
    let imageUrl: string | undefined;
    if (updateCollectionDto.imageStorageId) {
      try {
        const storage = await this.storageService.getStorage({
          id: updateCollectionDto.imageStorageId,
          ownerId: user.id,
          label: StorageLabel.COLLECTION_IMAGE,
        });
        imageUrl = storage.url;
      } catch (e) {
        throw new BadRequestException('Invalid file');
      }
    }

    const collectionEntity = await this.collectionRepository.findOneByOrFail({
      id,
    });
    if (collectionEntity.ownerId !== user.id) {
      throw new BadRequestException('Collection owner mismatch');
    }
    collectionEntity.name = updateCollectionDto.name;
    collectionEntity.description = updateCollectionDto.description;
    if (updateCollectionDto.imageStorageId) {
      collectionEntity.imageStorageId = updateCollectionDto.imageStorageId;
      collectionEntity.imageUrl = imageUrl;
    }

    await collectionEntity.save();
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

    const [data, total] = await this.collectionRepository.findAndCountBy(where);
    return { data, total };
  }

  async getNftsInCollection(collectionId: string) {
    const collection = await this.collectionRepository.findOneByOrFail({
      id: collectionId,
    });
    if (collection.status === CollectionStatus.PUBLISHED) {
      const [data, total] = await this.nftRepository.findAndCountBy({
        collectionId: collection.id,
      });
      return { data, total };
    }
    return { data: [], total: 0 };
  }
}
