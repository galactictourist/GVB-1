import { BadRequestException } from '@nestjs/common';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { BlockchainNetwork } from '../../types/blockchain';
import { UserEntity } from '../../user/entity/user.entity';
import { MetadataAttribute, NftImmutable, NftStatus } from '../types';
import { CollectionEntity } from './collection.entity';

@Entity({ name: 'nft' })
@Unique('nft_uq', ['network', 'scAddress', 'tokenId'])
export class NftEntity extends BaseElement {
  @Column({
    enum: BlockchainNetwork,
    length: 20,
    nullable: true,
  })
  network?: BlockchainNetwork;

  @Column({
    length: 50,
    nullable: true,
  })
  scAddress?: string;

  @Column({
    length: 200,
    nullable: true,
  })
  tokenId?: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200, nullable: true })
  imageUrl?: string;

  @Column({ length: 200, nullable: true })
  imageIpfsUrl?: string;

  @Column({ nullable: true })
  description?: string;

  @Column('jsonb', { nullable: true })
  attributes?: MetadataAttribute[];

  @Column('jsonb', { nullable: true })
  rawMetadata?: object;

  @Column('jsonb', { nullable: true })
  properties?: object;

  @Column({ length: 200, nullable: true })
  metadataIpfsUrl?: string;

  @Column('uuid', { nullable: true })
  collectionId?: string;

  @ManyToOne(() => CollectionEntity, (collection) => collection.nfts, {
    nullable: true,
  })
  collection?: CollectionEntity;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  owner: UserEntity;

  @Column({
    enum: NftStatus,
    default: NftStatus.ACTIVE,
    length: 20,
  })
  status: NftStatus;

  @Column({
    enum: NftImmutable,
    default: NftImmutable.NO,
    length: 10,
  })
  immutable: NftImmutable;

  @Column({ length: 66, nullable: true })
  mintedTxId?: string;

  @Column({ length: 50, nullable: true })
  creatorWallet?: string;

  @Column('int', { nullable: true })
  royalty?: number;

  isActive() {
    return this.status === NftStatus.ACTIVE;
  }

  isMinted() {
    return !!this.mintedTxId;
  }

  isImmutable() {
    return this.immutable === NftImmutable.YES;
  }

  async generateMetadata() {
    return {
      name: this.name,
      description: this.description,
    };
  }

  getMetadataIpfsPath(cid: string) {
    return `ipfs://${cid}/metadata.json`;
  }

  validateBeforeMint() {
    if (!this.royalty) {
      throw new BadRequestException('Missing royalty');
    }
    if (!this.owner.wallet) {
      throw new BadRequestException('Missing user wallet');
    }
    if (!this.network || !this.scAddress || !this.tokenId) {
      throw new BadRequestException('Missing information');
    }
    if (!this.isImmutable() || !this.metadataIpfsUrl) {
      throw new BadRequestException('NFT information must be uploaded to IPFS');
    }
  }

  getMetadataPath() {
    if (this.metadataIpfsUrl) {
      return this.metadataIpfsUrl;
    } else {
      return `http://localhost/nft/${this.network}/${this.scAddress}/${this.tokenId}/metadata.json`;
    }
  }
}
