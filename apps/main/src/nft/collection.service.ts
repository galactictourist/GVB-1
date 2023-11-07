import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { ContextUser } from '~/main/types/user-request';
import { TopicEntity } from '../charity/entity/topic.entity';
import { TopicService } from '../charity/topic.service';
import { StorageService } from '../storage/storage.service';
import { StorageLabel } from '../storage/types';
import { BlockchainNetwork } from '../types/blockchain';
import { AdminRepository } from '../user/repository/admin.repository';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FilterCollectionDto } from './dto/filter-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionEntity } from './entity/collection.entity';
import { NftService } from './nft.service';
import { CollectionRepository } from './repository/collection.repository';
import { NftRepository } from './repository/nft.repository';
import { CollectionStatus } from './types';

@Injectable()
export class CollectionService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly collectionRepository: CollectionRepository,
    private readonly storageService: StorageService,
    private readonly nftRepository: NftRepository,
    private readonly topicService: TopicService,
    private readonly nftService: NftService,
  ) {}

  async createCollection(
    file: Express.Multer.File,
    createCollectionDto: CreateCollectionDto,
    defaults: DeepPartial<CollectionEntity>,
    user: ContextUser,
  ) {
    // if (createCollectionDto.imageStorageId) {
    //   try {
    //     const storage = await this.storageService.getStorage({
    //       id: createCollectionDto.imageStorageId,
    //       ownerId: user.id,
    //       label: StorageLabel.COLLECTION_IMAGE,
    //     });
    //     imageUrl = storage.url;
    //   } catch (e) {
    //     throw new BadRequestException('Invalid file');
    //   }
    // }
    const storage = await this.storageService.storePublicReadFile(file, {
      ownerId: user.id,
      label: StorageLabel.COLLECTION_IMAGE,
    });

    let topic: TopicEntity | undefined;
    if (createCollectionDto.topicId) {
      topic = await this.topicService.getTopic(createCollectionDto.topicId);
      if (!topic || topic.isParent) {
        throw new BadRequestException('Topic is invalid');
      }
    }

    const collectionEntity = this.collectionRepository.create({
      ...defaults,
      name: createCollectionDto.name,
      description: createCollectionDto.description,
      imageStorageId: storage.id,
      imageUrl: storage.url,
      topicId: topic ? topic.id : undefined,
      artistAddress: createCollectionDto.artistAddress,
    });

    await collectionEntity.save();

    this.nftService.importNfts(
      {
        network: BlockchainNetwork.POLYGON_MUMBAI,
        nftContractAddress: process.env.CONTRACT_ADDRESS?.toString() || '',
        owner: user.wallet,
      },
      String(user.wallet),
      collectionEntity.id,
    );

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
          label: StorageLabel.COLLECTION_IMAGE,
        });
        imageUrl = storage.url;
      } catch (e) {
        throw new BadRequestException('Invalid file');
      }
    }

    let topic: TopicEntity | undefined;
    if (updateCollectionDto.topicId) {
      topic = await this.topicService.getTopic(updateCollectionDto.topicId);
      if (!topic || topic.isParent) {
        throw new BadRequestException('Topic is invalid');
      }
    }

    const collectionEntity = await this.collectionRepository.findOneByOrFail({
      id,
    });

    collectionEntity.name = updateCollectionDto.name;
    collectionEntity.artistAddress = updateCollectionDto.artistAddress;
    collectionEntity.description = updateCollectionDto.description;
    collectionEntity.status = CollectionStatus[updateCollectionDto.status];
    if (updateCollectionDto.imageStorageId) {
      collectionEntity.imageStorageId = updateCollectionDto.imageStorageId;
      collectionEntity.imageUrl = imageUrl;
    }
    if (updateCollectionDto.topicId) {
      collectionEntity.topicId = updateCollectionDto.topicId;
    }

    await collectionEntity.save();
    return collectionEntity;
  }

  async searchCollectionByCollectionId(collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: {
        id: collectionId,
      },
      relations: {
        topic: true,
      },
    });
    const causeId = collection?.topic?.parentId;
    if (causeId) {
      const topic = await this.topicService.getTopic(causeId);
      return { ...collection, ...{ cause: topic.name } };
    }
    return collection;
  }

  async searchCollectionByOwners(
    searchCollectionDto: FilterCollectionDto,
    defaults: FindOptionsWhere<CollectionEntity>,
  ) {
    const where: FindOptionsWhere<CollectionEntity> = {
      ...defaults,
    };
    if (searchCollectionDto.ownerIds && searchCollectionDto.ownerIds.length) {
      where.ownerId = In(searchCollectionDto.ownerIds);
    }

    const [data, count] = await this.collectionRepository.findAndCount({
      where,
      order: {
        name: 'DESC',
      },
    });

    return { data, total: count };
  }

  async getNftsInCollection(collectionId: string) {
    const collection = await this.collectionRepository.findOneByOrFail({
      id: collectionId,
    });
    if (collection.status === CollectionStatus.PUBLISHED) {
      // const [data, total] = await this.nftRepository.findAndCountBy({
      //   collectionId: collection.id,
      // });
      const nfts = await this.nftRepository.find({
        where: {
          collectionId: collection.id,
        },
      });
      return nfts;
    }
    return [];
  }
}
