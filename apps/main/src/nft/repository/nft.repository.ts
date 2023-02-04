import { Injectable } from '@nestjs/common';
import { NftTokenType, OwnedNft } from 'alchemy-sdk';
import { DataSource, DeepPartial } from 'typeorm';
import { BaseRepository } from '~/main/lib/database/base-repository';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { NftEntity } from '../entity/nft.entity';
import { NftStatus } from '../types';

@Injectable()
export class NftRepository extends BaseRepository<NftEntity> {
  constructor(private dataSource: DataSource) {
    super(NftEntity, dataSource.createEntityManager());
  }

  private checkNftTokenTypeSupported(nftTokenType: NftTokenType) {
    const SUPPORTED_ERC721_STANDARD: { [key in NftTokenType]: boolean } = {
      [NftTokenType.ERC721]: true,
      [NftTokenType.ERC1155]: false,
      [NftTokenType.UNKNOWN]: false,
    };

    return SUPPORTED_ERC721_STANDARD[nftTokenType];
  }
  async createFromOwnedNfts(
    network: BlockchainNetwork,
    ownedNfts: OwnedNft[],
    defaults: DeepPartial<NftEntity>,
  ) {
    return Promise.allSettled(
      ownedNfts.map((ownedNft) => {
        return this.createFromOwnedNft(network, ownedNft, defaults);
      }),
    );
  }

  async createFromOwnedNft(
    network: BlockchainNetwork,
    ownedNft: OwnedNft,
    defaults: DeepPartial<NftEntity>,
  ) {
    if (!this.checkNftTokenTypeSupported(ownedNft.tokenType)) {
      throw new Error('Token standard is not supported');
    }

    const scAddress = ownedNft.contract.address.toLowerCase();
    const tokenId = ownedNft.tokenId;

    let raw;
    if (ownedNft.rawMetadata) {
      const { name, description, ...rawMetadata } = ownedNft.rawMetadata;
      raw = rawMetadata;
    }

    let nftEntity = await this.getNftByNetworkAddressTokenId(
      network,
      scAddress,
      tokenId,
    );
    if (!nftEntity) {
      nftEntity = this.create({
        network,
        scAddress,
        tokenId,
      });
    }

    this.merge(nftEntity, {
      ...defaults,
      status: NftStatus.ACTIVE,
      name: ownedNft.title,
      description: ownedNft.description,
      rawMetadata: raw,
      attributes: ownedNft.rawMetadata?.attributes,
    });

    await nftEntity.save();

    return nftEntity;
  }

  async getNftByNetworkAddressTokenId(
    network: BlockchainNetwork,
    scAddress: string,
    tokenId: string,
  ): Promise<NftEntity | null> {
    const nft = await this.findOneBy({
      network,
      scAddress: scAddress.toLowerCase(),
      tokenId,
    });
    return nft;
  }
}
