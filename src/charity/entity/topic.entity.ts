import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CharityTopicEntity } from './charity-topic.entity';

@Entity({ schema: 'charity', name: 'topic' })
export class TopicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column('uuid')
  parentId: string;

  @ManyToOne(() => TopicEntity, (topic) => topic.id)
  parent: TopicEntity;

  @OneToMany(() => TopicEntity, (topic) => topic.parent)
  children: TopicEntity[];

  @OneToMany(() => CharityTopicEntity, (charityTopic) => charityTopic.topicId)
  charityTopics: CharityTopicEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
