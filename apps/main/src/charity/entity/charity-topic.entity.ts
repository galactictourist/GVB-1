import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { CountryCode } from '~/main/types/country';
import { CharityEntity } from './charity.entity';
import { TopicEntity } from './topic.entity';

@Entity({ name: 'charity_topic' })
@Unique('charity_topic_uq', ['charityId', 'topicId', 'countryCode'])
export class CharityTopicEntity extends BaseElement {
  @Column('uuid')
  charityId: string;

  @Column('uuid')
  topicId: string;

  @Column({ enum: CountryCode, length: 2 })
  countryCode: CountryCode;

  @Column({ length: 50, nullable: true })
  wallet?: string;

  @ManyToOne(() => CharityEntity, (charity) => charity.charityTopics)
  charity: CharityEntity;

  @ManyToOne(() => TopicEntity, (topic) => topic.charityTopics)
  topic: TopicEntity;
}
