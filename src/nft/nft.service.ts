import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { BlockchainNetwork } from '~/types/blockchain';
import { FilterNftDto } from './dto/filter-nft.dto';
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
    return nft;
  }
}
