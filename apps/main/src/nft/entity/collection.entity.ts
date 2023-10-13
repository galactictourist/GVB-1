import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { TopicEntity } from '~/main/charity/entity/topic.entity';
import { BaseElement } from '~/main/lib/database/base-element';
import { StorageEntity } from '~/main/storage/entity/storage.entity';
import { UserEntity } from '~/main/user/entity/user.entity';
import { CollectionStatus } from '../types';
import { NftEntity } from './nft.entity';

@Entity({ name: 'collection' })
@Index('collection_ownerId_idx', ['ownerId'])
@Index('collection_status_idx', ['status'])
export class CollectionEntity extends BaseElement {
  @Column({ length: 200 })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  owner: UserEntity;

  @Column('uuid', { nullable: true })
  imageStorageId: string | null;

  @ManyToOne(() => StorageEntity, (storage) => storage.id, { nullable: true })
  imageStorage: StorageEntity | null;

  @Column({ length: 200, nullable: true })
  imageUrl?: string;

  @Column({
    type: 'varchar',
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
    length: 20,
  })
  status: CollectionStatus;

  @OneToMany(() => NftEntity, (nft) => nft.collection)
  nfts: NftEntity[];

  @Column('uuid', { nullable: true })
  topicId?: string;

  @ManyToOne(() => TopicEntity, (topic) => topic.collections, {
    nullable: true,
  })
  topic?: TopicEntity;

  @Column({
    nullable: false,
    default: '',
  })
  artistAddress: string;

  isPublished() {
    return this.status === CollectionStatus.PUBLISHED;
  }
}
