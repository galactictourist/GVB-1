import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In, IsNull } from 'typeorm';
import { MarketSmartContractService } from '~/blockchain/market-smart-contracts.service';
import { SignerService } from '~/blockchain/signer.service';
import { randomTokenId } from '~/lib';
import { NftStorageService } from '~/shared/nft-storage.service';
import { BlockchainNetwork, BLOCKCHAIN_INFO } from '~/types/blockchain';
import { ContextUser } from '~/types/user-request';
import { CreateNftDto } from './dto/create-nft.dto';
import { GenerateTokenIdDto } from './dto/generate-token-id.dto';
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

  private getSmartContractAddress(network: BlockchainNetwork) {
    return BLOCKCHAIN_INFO[network].constract.erc721.address;
  }

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
    nftEntity.name = updateNftDto.name;
    nftEntity.description = updateNftDto.description;

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

  async preMint(
    id: string,
    generateTokenIdDto: GenerateTokenIdDto,
    user: ContextUser,
  ) {
    const nftEntity = await this.nftRepository.findOneByOrFail({
      id,
      tokenId: IsNull(),
    });
    if (nftEntity.ownerId !== user.id) {
      throw new BadRequestException('NFT owner mismatch');
    }

    nftEntity.network = generateTokenIdDto.network;
    nftEntity.scAddress = this.getSmartContractAddress(
      generateTokenIdDto.network,
    );
    nftEntity.tokenId = randomTokenId();

    await nftEntity.save();
    return nftEntity;
  }

  async generateMintSignature(id: string, user: ContextUser) {
    const nftEntity = await this.nftRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['owner'],
    });
    if (!nftEntity.owner.wallet) {
      throw new BadRequestException('Missing user wallet');
    }
    if (nftEntity.ownerId !== user.id) {
      throw new BadRequestException('NFT owner mismatch');
    }
    if (!nftEntity.network || !nftEntity.scAddress || !nftEntity.tokenId) {
      throw new BadRequestException('Missing information');
    }
    if (!nftEntity.isImmutable() || !nftEntity.metadataIpfsUrl) {
      throw new BadRequestException('NFT information must be uploaded to IPFS');
    }

    const nonce = await this.marketSmartContractService.getNonce(
      nftEntity.network,
      nftEntity.owner.wallet,
    );
    const signature = await this.signerService.signForMinting(
      nftEntity.network,
      {
        account: nftEntity.owner.wallet || '',
        collection: nftEntity.scAddress,
        tokenId: nftEntity.tokenId,
        royaltyFee: nftEntity.royalty || 0,
        tokenURI: nftEntity.metadataIpfsUrl,
        deadline: Math.round(new Date().getTime() / 1000) + 6000,
        nonce,
      },
    );

    return signature;
  }
}
