import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { BlockchainNetwork } from '~/types/blockchain';
import { ContextUser } from '~/types/user-request';
import { CreateNftDto } from './dto/create-nft.dto';
import { SearchNftDto } from './dto/search-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftEntity } from './entity/nft.entity';
import { NftRepository } from './repository/nft.repository';

@Injectable()
export class NftService {
  constructor(private readonly nftRepository: NftRepository) {}

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
    const nft = await this.nftRepository.findOneBy({
      network,
      scAddress,
      tokenId,
    });
    if (!nft) {
      throw new NotFoundException('Nft not found');
    }
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
    const nftEntity = await this.nftRepository.findOneBy({
      id,
    });
    if (!nftEntity) {
      throw new NotFoundException('Nft not found');
    }
    if (nftEntity.ownerId !== user.id) {
      throw new BadRequestException('Nft owner mismatch');
    }
    nftEntity.name = updateNftDto.name;
    nftEntity.description = updateNftDto.description;

    await nftEntity.save();
    return nftEntity;
  }
}
