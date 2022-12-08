import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { MarketSmartContractService } from '~/blockchain/market-smart-contracts.service';
import { SignerService } from '~/blockchain/signer.service';
import { randomTokenId } from '~/lib';
import { deadlineIn } from '~/lib/web3';
import { NftStorageService } from '~/shared/nft-storage.service';
import { BlockchainNetwork, getErc721SmartContract } from '~/types/blockchain';
import { ContextUser } from '~/types/user-request';
import { CreateNftDto } from './dto/create-nft.dto';
import { SearchNftDto } from './dto/search-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftEntity } from './entity/nft.entity';
import { NftRepository } from './repository/nft.repository';
import { NftImmutable } from './types';

@Injectable()
export class NftService {
  constructor(
    private readonly nftRepository: NftRepository,
    private readonly signerService: SignerService,
    private readonly nftStorageService: NftStorageService,
    private readonly marketSmartContractService: MarketSmartContractService,
  ) {}

  async search(
    searchNftDto: SearchNftDto,
    defaults: FindOptionsWhere<NftEntity>,
  ) {
    const where: FindOptionsWhere<NftEntity> = {};
    if (searchNftDto.filter?.ownerIds && searchNftDto.filter.ownerIds.length) {
      where.ownerId = In(searchNftDto.filter.ownerIds);
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

  async getNftByNetworkAddressTokenId(
    network: BlockchainNetwork,
    scAddress: string,
    tokenId: string,
  ) {
    const nft = await this.nftRepository.findOneByOrFail({
      network,
      scAddress,
      tokenId,
    });
    return nft;
  }

  async createNft(
    createNftDto: CreateNftDto,
    defaults: DeepPartial<NftEntity>,
  ) {
    const nftEntity = this.nftRepository.create({
      ...defaults,
      name: createNftDto.name,
      description: createNftDto.description,
      royalty: createNftDto.royalty,
      network: createNftDto.network,
    });

    await nftEntity.save();
    return nftEntity;
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
    nftEntity.royalty = updateNftDto.royalty || nftEntity.royalty;
    nftEntity.network = updateNftDto.network || nftEntity.network;

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

  private async generateTokenId(nftEntity: NftEntity) {
    if (!nftEntity.network) {
      throw new BadRequestException('Network is not set');
    }
    if (!nftEntity.scAddress || !nftEntity.tokenId) {
      await this.nftRepository.update(nftEntity.id, {
        network: nftEntity.network,
        scAddress: getErc721SmartContract(nftEntity.network).address,
        tokenId: randomTokenId(),
      });
      await nftEntity.reload();
    }
  }

  async mint(id: string, user: ContextUser) {
    const nftEntity = await this.nftRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['owner'],
    });
    if (nftEntity.ownerId !== user.id) {
      throw new BadRequestException('NFT owner mismatch');
    }
    if (!nftEntity.owner.wallet) {
      throw new BadRequestException('Missing user wallet');
    }

    await this.generateTokenId(nftEntity);
    if (!nftEntity.network || !nftEntity.scAddress || !nftEntity.tokenId) {
      throw new BadRequestException('Missing information');
    }
    if (!nftEntity.royalty) {
      throw new BadRequestException('Royalty is not set');
    }

    const nonce = await this.marketSmartContractService.getNonce(
      nftEntity.network,
      nftEntity.owner.wallet,
    );

    const data = {
      account: nftEntity.owner.wallet,
      collection: nftEntity.scAddress,
      tokenId: nftEntity.tokenId,
      royaltyFee: nftEntity.royalty,
      tokenURI: nftEntity.getMetadataUrl(),
      deadline: deadlineIn(600),
      nonce,
    };

    const signature = await this.signerService.signForMinting(
      nftEntity.network,
      data,
    );

    return { ...signature, data };
  }
}
