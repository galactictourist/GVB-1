import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { StorageEntity } from '~/main/storage/entity/storage.entity';
import { BlockchainNetwork } from '../../types/blockchain';
import { UserEntity } from '../../user/entity/user.entity';
import { MetadataAttribute, NftImmutable, NftStatus } from '../types';
import { CollectionEntity } from './collection.entity';

@Entity({ name: 'nft' })
@Index('nft_uq', { synchronize: false }) // https://typeorm.io/indices#disabling-synchronization
@Unique('nft_network_mintedTxId_uq', ['network', 'mintedTxId'])
@Index('nft_ownerId_idx', ['ownerId'])
@Index('nft_collectionId_idx', ['collectionId'])
@Index('nft_status_idx', ['status'])
@Index('nft_imageStorageId_idx', ['imageStorageId'])
export class NftEntity extends BaseElement {
  @Column({
    type: 'varchar',
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

  @Column('uuid', { nullable: true })
  imageStorageId: string | null;

  @ManyToOne(() => StorageEntity, (storage) => storage.id, { nullable: true })
  imageStorage: StorageEntity | null;

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

  @Column('uuid', { nullable: true })
  ownerId?: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  owner?: UserEntity;

  @Column({
    type: 'varchar',
    enum: NftStatus,
    default: NftStatus.ACTIVE,
    length: 20,
  })
  status: NftStatus;

  @Column({
    type: 'varchar',
    enum: NftImmutable,
    default: NftImmutable.NO,
    length: 10,
  })
  immutable: NftImmutable;

  @Column({ length: 66, nullable: true })
  mintedTxId?: string;

  @Column({ length: 50, nullable: true })
  creatorWallet?: string;

  @Column('int', { default: 0 })
  royalty: number;

  isActive() {
    return this.status === NftStatus.ACTIVE;
  }

  isMinted() {
    return !!this.mintedTxId;
  }

  isImmutable() {
    return this.immutable === NftImmutable.YES;
  }

  async generateMetadata(): Promise<Record<string, unknown>> {
    return {
      ...this.rawMetadata,
      name: this.name,
      description: this.description,
    };
  }

  getMetadataIpfsPath(cid: string) {
    return `ipfs://${cid}/metadata.json`;
  }

  getMetadataUrl() {
    if (this.metadataIpfsUrl) {
      return this.metadataIpfsUrl;
    } else {
      return `http://localhost/nft/${this.network}/${this.scAddress}/${this.tokenId}/metadata.json`;
    }
  }
}
