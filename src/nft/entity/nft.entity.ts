import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { BlockchainNetwork } from '../../types/blockchain';
import { UserEntity } from '../../user/entity/user.entity';
import { NftStatus } from '../types';
import { CollectionEntity } from './collection.entity';

@Entity({ schema: 'nft', name: 'nft' })
export class NftEntity extends BaseElement {
  @Column({
    enum: BlockchainNetwork,
    length: 20,
  })
  network: string;

  @Column({
    length: 50,
  })
  scAddress: string;

  @Column({
    length: 200,
  })
  tokenId: string;

  @Column('uuid')
  collectionId: string;

  @ManyToOne(() => CollectionEntity, (collection) => collection.id)
  collection: CollectionEntity;

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

  isActive() {
    return this.status === NftStatus.ACTIVE;
  }
}
