import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OwnedNftsResponse } from 'alchemy-sdk';
import { isZeroAddress } from 'ethereumjs-util';
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { NftStorageService } from '~/main/shared/nft-storage.service';
import { StorageService } from '~/main/storage/storage.service';
import { StorageLabel } from '~/main/storage/types';
import {
  BlockchainNetwork,
  getErc721SmartContract,
} from '~/main/types/blockchain';
import { ContextUser } from '~/main/types/user-request';
import { NftSmartContractService } from '../blockchain/nft-smart-contracts.service';
import { Erc721TransferEvent } from '../blockchain/types/event';
import { TopicService } from '../charity/topic.service';
import { randomUnit256 } from '../lib';
import { AlchemyNftService } from '../shared/alchemy-nft.service';
import { UserService } from '../user/user.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { FilterNftParam } from './dto/filter-nft.param';
import { ImportNftsDto } from './dto/import-nfts.dto';
import { SearchNftDto } from './dto/search-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftEntity } from './entity/nft.entity';
import { NftRepository } from './repository/nft.repository';
import { NftImmutable, NftStatus } from './types';

@Injectable()
export class NftService {
  constructor(
    private readonly nftRepository: NftRepository,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly nftStorageService: NftStorageService,
    private readonly nftSmartContractService: NftSmartContractService,
    private readonly alchemyNftService: AlchemyNftService,
    private readonly topicService: TopicService,
    private readonly dataSource: DataSource,
  ) {}

  async search(
    searchNftDto: SearchNftDto = {},
    defaults: FindOptionsWhere<NftEntity> = {},
  ) {
    const where: FindOptionsWhere<NftEntity> = {};
    if (searchNftDto.filter?.ids && searchNftDto.filter.ids.length) {
      where.id = In(searchNftDto.filter.ids);
    }
    if (searchNftDto.filter?.ownerIds && searchNftDto.filter.ownerIds.length) {
      where.ownerId = In(searchNftDto.filter.ownerIds);
    }
    if (
      searchNftDto.filter?.collectionIds &&
      searchNftDto.filter.collectionIds.length
    ) {
      where.collectionId = In(searchNftDto.filter.collectionIds);
    }
    if (searchNftDto.filter?.networks && searchNftDto.filter.networks.length) {
      where.network = In(searchNftDto.filter.networks);
    }

    const result = await this.nftRepository.simplePaginate(
      {
        ...where,
        ...defaults,
      },
      searchNftDto.pagination,
    );
    return result;
  }

  async importNfts(
    importNftsDto: ImportNftsDto,
    wallet: string,
    collectionId?: string,
  ) {
    const userEntity = await this.userService.findOrCreateOneByWallet(wallet);

    const doImportNfts = async (nfts: OwnedNftsResponse) => {
      return this.nftRepository.createFromOwnedNfts(
        importNftsDto.network,
        nfts.ownedNfts,
        {
          ownerId: userEntity.id,
          immutable: NftImmutable.YES,
          isImmutable: true,
        },
        collectionId,
      );
    };

    await this.alchemyNftService.getNftsForOwnerByContractAddress(
      importNftsDto.network,
      wallet,
      importNftsDto.nftContractAddress,
      doImportNfts,
    );

    console.log('Imported NFTs');
  }

  private _generateFindOptions(filterParam: FilterNftParam = {}) {
    const where: FindOptionsWhere<NftEntity> = {};
    if (filterParam.ids && filterParam.ids.length) {
      where.id = In(filterParam.ids);
    }
    if (filterParam?.ownerIds && filterParam.ownerIds.length) {
      where.ownerId = In(filterParam.ownerIds);
    }
    if (filterParam?.collectionIds && filterParam.collectionIds.length) {
      where.collectionId = In(filterParam.collectionIds);
    }
    if (filterParam?.networks && filterParam.networks.length) {
      where.network = In(filterParam.networks);
    }

    return where;
  }

  async findNft(nftId: string, { relations }: FindOneOptions<NftEntity> = {}) {
    const nft = await this.nftRepository.findOne({
      where: { id: nftId },
      relationLoadStrategy: 'query',
      relations,
    });
    if (nft && nft.collection && nft.collection.topicId) {
      const topic = await this.topicService.getTopic(nft?.collection?.topicId);
      if (topic && topic.parentId) {
        const cause = await this.topicService.getTopic(topic.parentId);
        return { ...nft, ...{ cause: cause } };
      }
    }
    return nft;
  }

  async findById(
    nftId: string,
    { relations }: FindOneOptions<NftEntity> = {},
  ): Promise<NftEntity | null> {
    const nft = await this.nftRepository.findOne({
      where: { id: nftId },
      relationLoadStrategy: 'query',
      relations,
    });
    return nft;
  }

  async query(
    filterParam: FilterNftParam,
    defaults: FindManyOptions<NftEntity> = {},
  ) {
    const where = this._generateFindOptions(filterParam);

    return this.nftRepository.findAndCount({ ...defaults, where });
  }

  async count(
    filterParam: FilterNftParam,
    defaults: FindManyOptions<NftEntity> = {},
  ) {
    const where = this._generateFindOptions(filterParam);

    return this.nftRepository.count({
      ...defaults,
      where,
    });
  }

  async getNftByNetworkAddressTokenId(
    network: BlockchainNetwork,
    scAddress: string,
    tokenId: number,
  ) {
    const nftEntity = await this.nftRepository.getNftByNetworkAddressTokenId(
      network,
      scAddress,
      tokenId,
    );
    if (!nftEntity) {
      throw new NotFoundException();
    }
    return nftEntity;
  }

  async createNft(
    createNftDto: CreateNftDto,
    defaults: DeepPartial<NftEntity>,
    user: ContextUser,
  ) {
    let imageUrl: string | undefined;
    if (createNftDto.imageStorageId) {
      try {
        const storage = await this.storageService.getStorage({
          id: createNftDto.imageStorageId,
          ownerId: user.id,
          label: StorageLabel.NFT_IMAGE,
        });
        imageUrl = storage.url;
      } catch (e) {
        throw new BadRequestException('Invalid file');
      }
    }

    const nftEntity = this.nftRepository.create({
      ...defaults,
      name: createNftDto.name,
      description: createNftDto.description,
      royalty: createNftDto.royalty,
      network: createNftDto.network,
      scAddress: getErc721SmartContract(createNftDto.network).address,
      tokenId: Number(randomUnit256()),
      imageStorageId: createNftDto.imageStorageId,
      rawMetadata: createNftDto.metadata,
      collectionId: createNftDto.collectionId,
      imageUrl,
    });

    await nftEntity.save();
    return nftEntity;
  }

  async bulkUpload(
    createNftDto: CreateNftDto[],
    defaults: DeepPartial<NftEntity>,
    user: ContextUser,
  ) {
    const nfts: NftEntity[] = [];
    for (let i = 0; i < createNftDto.length; i++) {
      let imageUrl: string | undefined;
      const nftdto = createNftDto[i];
      if (nftdto.imageStorageId) {
        try {
          const storage = await this.storageService.getStorage({
            id: nftdto.imageStorageId,
            ownerId: user.id,
            label: StorageLabel.NFT_IMAGE,
          });
          imageUrl = storage.url;
        } catch (e) {
          throw new BadRequestException('Invalid file');
        }
      }

      const nftEntity = this.nftRepository.create({
        ...defaults,
        name: nftdto.name,
        description: nftdto.description,
        royalty: nftdto.royalty,
        network: nftdto.network,
        scAddress: getErc721SmartContract(nftdto.network).address,
        tokenId: Number(randomUnit256()),
        imageStorageId: nftdto.imageStorageId,
        rawMetadata: nftdto.metadata,
        collectionId: nftdto.collectionId,
        imageUrl,
      });

      nfts.push(nftEntity);
    }
    return await this.dataSource.manager.save(nfts);
  }

  async updateNft(id: string, updateNftDto: UpdateNftDto, user: ContextUser) {
    const nftEntity = await this.nftRepository.findOneByOrFail({
      id,
    });
    if (nftEntity.ownerId !== user.id) {
      throw new BadRequestException('NFT owner mismatch');
    }
    if (nftEntity.isImmutable()) {
      throw new BadRequestException('NFT is immutable');
    }
    nftEntity.name = updateNftDto.name || nftEntity.name;
    nftEntity.description = updateNftDto.description || nftEntity.description;

    await nftEntity.save();
    return nftEntity;
  }

  async setImmutable(id: string, user: ContextUser) {
    const nftEntity = await this.nftRepository.findOneByOrFail({
      id,
    });
    if (nftEntity.ownerId !== user.id) {
      throw new BadRequestException('NFT owner mismatch');
    }
    if (!nftEntity.isImmutable()) {
      const metadata = await nftEntity.generateMetadata();
      const cid = await this.nftStorageService.upload(metadata);
      nftEntity.immutable = NftImmutable.YES;
      nftEntity.metadataIpfsUrl = nftEntity.getMetadataIpfsPath(cid.toString());
      await nftEntity.save();
    }

    return nftEntity;
  }

  // private async generateTokenId(nftEntity: NftEntity) {
  //   if (!nftEntity.network) {
  //     throw new BadRequestException('Network is not set');
  //   }
  //   if (!nftEntity.scAddress || !nftEntity.tokenId) {
  //     await this.nftRepository.update(nftEntity.id, {
  //       network: nftEntity.network,
  //       scAddress: getErc721SmartContract(nftEntity.network).address,
  //       tokenId: randomUnit256(),
  //     });
  //     await nftEntity.reload();
  //   }
  // }

  // async mint(id: string, mintNftDto: MintNftDto, user: ContextUser) {
  //   const nftEntity = await this.nftRepository.findOneOrFail({
  //     where: {
  //       id,
  //     },
  //     relations: ['owner'],
  //   });
  //   if (nftEntity.ownerId !== user.id) {
  //     throw new BadRequestException('NFT owner mismatch');
  //   }
  //   if (!nftEntity.owner?.wallet) {
  //     throw new BadRequestException('Missing user wallet');
  //   }

  //   await this.generateTokenId(nftEntity);
  //   if (!nftEntity.network || !nftEntity.scAddress || !nftEntity.tokenId) {
  //     throw new BadRequestException('Missing information');
  //   }
  //   if (!nftEntity.royalty) {
  //     throw new BadRequestException('Royalty is not set');
  //   }

  //   const nonce =
  //     mintNftDto.nonce ||
  //     (
  //       await this.marketSmartContractService.getNonce(
  //         nftEntity.network,
  //         nftEntity.owner.wallet,
  //       )
  //     ).toString();

  //   const data = {
  //     account: nftEntity.owner.wallet,
  //     collection: nftEntity.scAddress,
  //     tokenId: nftEntity.tokenId,
  //     royaltyFee: nftEntity.royalty,
  //     tokenURI: nftEntity.getMetadataUrl(),
  //     deadline: deadlineIn(600),
  //     nonce,
  //   };

  //   const signature = await this.signerService.signForMinting(
  //     nftEntity.network,
  //     data,
  //   );

  //   return { ...signature, data };
  // }

  async processTransferedNfts(
    network: BlockchainNetwork,
    fromBlock: number,
    toBlock: number,
  ) {
    console.log('processTransferedNfts');
    const events = await this.nftSmartContractService.getTransferEvents(
      network,
      fromBlock,
      toBlock,
    );

    const result = await Promise.allSettled(
      events.map((event) => {
        return this.processNftTransfer(network, event);
      }),
    );

    return result;
  }

  private async processNftTransfer(
    network: BlockchainNetwork,
    event: Erc721TransferEvent,
  ): Promise<boolean> {
    try {
      const nft = await this.nftRepository.findOneByOrFail({
        network,
        scAddress: event.blockchainEvent.address.toLowerCase(),
        tokenId: Number(event.tokenId),
      });

      const owner = await this.userService.findOrCreateOneByWallet(event.to);

      nft.ownerId = owner.id;
      if (isZeroAddress(event.from)) {
        nft.mintedTxId = event.blockchainEvent.transactionHash;
      }
      await this.nftRepository.save(nft);

      return true;
    } catch (e) {
      console.error('processNftTransfer failed', e);
      return false;
    }
  }

  async nftTransfer(network: BlockchainNetwork, nftId: string, to: string) {
    try {
      const nft = await this.nftRepository.findOneByOrFail({
        id: nftId,
        network,
      });

      const owner = await this.userService.findOrCreateOneByWallet(to);

      nft.ownerId = owner.id;
      // if (isZeroAddress(from)) {
      //   nft.mintedTxId = event.blockchainEvent.transactionHash;
      // }
      await this.nftRepository.save(nft);

      return true;
    } catch (e) {
      console.error('nftTransfer failed', e);
      return false;
    }
  }

  async findNfts(
    collectionId: string,
    nftTokenId: number,
    nftQuantityForList: number,
    ownerId: string,
  ) {
    try {
      const nfts = await this.nftRepository.find({
        where: {
          collectionId: collectionId,
          ownerId: ownerId,
          isMinted: true,
          status: NftStatus.ACTIVE,
        },
        relations: {
          owner: true,
          collection: true,
        },
        skip: nftTokenId,
        take: nftQuantityForList,
      });
      return nfts;
    } catch (e) {
      console.error('FindNfts failed', e);
      return false;
    }
  }
}
