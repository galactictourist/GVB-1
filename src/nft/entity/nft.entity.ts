import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { CharityEntity } from '~/charity/entity/charity.entity';
import { TopicEntity } from '~/charity/entity/topic.entity';
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
  network: BlockchainNetwork;

  @Column({
    length: 50,
  })
  scAddress: string;

  @Column({
    length: 200,
  })
  tokenId: string;

  @Column('uuid', { nullable: true })
  collectionId?: string;

  @ManyToOne(() => CollectionEntity, (collection) => collection.id, {
    nullable: true,
  })
  collection?: CollectionEntity;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  owner: UserEntity;

  @Column('uuid', { nullable: true })
  charityId?: string;

  @Column('uuid', { nullable: true })
  topicId?: string;

  @OneToOne(() => CharityEntity, (charity) => charity.id, { nullable: true })
  charity?: CharityEntity;

  @OneToOne(() => TopicEntity, (topic) => topic.id, { nullable: true })
  topic?: TopicEntity;

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
