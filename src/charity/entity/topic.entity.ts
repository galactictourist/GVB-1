import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { CharityTopicEntity } from './charity-topic.entity';

@Entity({ schema: 'charity', name: 'topic' })
export class TopicEntity extends BaseElement {
  @Column({ length: 200 })
  name: string;

  @Column('uuid', { nullable: true })
  parentId?: string;

  @ManyToOne(() => TopicEntity, (topic) => topic.id, { nullable: true })
  parent?: TopicEntity;

  @OneToMany(() => TopicEntity, (topic) => topic.parent)
  children: TopicEntity[];

  @OneToMany(() => CharityTopicEntity, (charityTopic) => charityTopic.topicId)
  charityTopics: CharityTopicEntity[];
}
