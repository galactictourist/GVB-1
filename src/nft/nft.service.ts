import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { BlockchainNetwork } from '~/types/blockchain';
import { ContextUser } from '~/types/user-request';
import { CreateNftDto } from './dto/create-nft.dto';
import { FilterNftDto } from './dto/filter-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftEntity } from './entity/nft.entity';
import { NftRepository } from './repository/nft.repository';

@Injectable()
export class NftService {
  constructor(private readonly nftRepository: NftRepository) {}

  async search(
    searchNftDto: FilterNftDto,
    defaults: FindOptionsWhere<NftEntity>,
  ) {
    const where: FindOptionsWhere<NftEntity> = {
      ...defaults,
    };
    if (searchNftDto.ownerIds && searchNftDto.ownerIds.length) {
      where.ownerId = In(searchNftDto.ownerIds);
    }
    console.log('where', where);

    const [data, total] = await this.nftRepository.findAndCountBy(where);
    return { data, total };
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
