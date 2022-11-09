import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { UserEntity } from '../../user/entity/user.entity';
import { CollectionStatus } from '../types';
import { NftEntity } from './nft.entity';

@Entity({ schema: 'nft', name: 'collection' })
export class CollectionEntity extends BaseElement {
  @Column({ nullable: false, length: 200 })
  name: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  owner: UserEntity;

  @Column({
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
    length: 20,
  })
  status: CollectionStatus;

  @OneToMany(() => NftEntity, (nft) => nft.collection)
  nfts: NftEntity[];

  isPublished() {
    return this.status === CollectionStatus.PUBLISHED;
  }
}
