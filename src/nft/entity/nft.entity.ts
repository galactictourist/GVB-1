import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { BlockchainNetwork } from '../../types/blockchain';
import { UserEntity } from '../../user/entity/user.entity';
import { NftStatus } from '../types';
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
  attributes?: { [key: string]: any };

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

  @Column({ length: 50, nullable: true })
  creatorWallet?: string;

  @Column('int', { nullable: true })
  royalty?: number;

  isActive() {
    return this.status === NftStatus.ACTIVE;
  }
}
