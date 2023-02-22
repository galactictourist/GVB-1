import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { SaleEntity } from '~/main/marketplace/entity/sale.entity';
import { CollectionEntity } from '~/main/nft/entity/collection.entity';
import { StorageEntity } from '~/main/storage/entity/storage.entity';
import { TopicStatus } from '../types';
import { CharityTopicEntity } from './charity-topic.entity';

@Entity({ name: 'topic' })
@Index('topic_parentId_idx', ['parentId'])
export class TopicEntity extends BaseElement {
  @Column({ length: 200 })
  name: string;

  @Column('uuid', { nullable: true })
  parentId?: string;

  @ManyToOne(() => TopicEntity, (topic) => topic.id, { nullable: true })
  parent?: TopicEntity;

  @OneToMany(() => TopicEntity, (topic) => topic.parent)
  children: TopicEntity[];

  @OneToMany(() => CharityTopicEntity, (charityTopic) => charityTopic.topic)
  charityTopics: CharityTopicEntity[];

  @OneToMany(() => SaleEntity, (sale) => sale.topic)
  sales: SaleEntity[];

  @OneToMany(() => CollectionEntity, (collection) => collection.topic)
  collections: CollectionEntity[];

  @Column('uuid', { nullable: true })
  imageStorageId: string | null;

  @ManyToOne(() => StorageEntity, (storage) => storage.id, { nullable: true })
  imageStorage: StorageEntity | null;

  @Column({ length: 200, nullable: true })
  imageUrl?: string;

  @Column({
    type: 'varchar',
    enum: TopicStatus,
    default: TopicStatus.ACTIVE,
    length: 20,
  })
  status: TopicStatus;
}
