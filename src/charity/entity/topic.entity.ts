import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { SaleEntity } from '~/marketplace/entity/sale.entity';
import { CharityTopicEntity } from './charity-topic.entity';

@Entity({ name: 'topic' })
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
}
