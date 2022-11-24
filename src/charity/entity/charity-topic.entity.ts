import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { CountryCode } from '~/types/country';
import { BlockchainNetwork } from '../../types/blockchain';
import { CharityEntity } from './charity.entity';
import { TopicEntity } from './topic.entity';

@Entity({ name: 'charity_topic' })
export class CharityTopicEntity extends BaseElement {
  @Column('uuid')
  charityId: string;

  @Column('uuid')
  topicId: string;

  @Column({ enum: CountryCode, length: 2 })
  countryCode: CountryCode;

  @Column({
    enum: BlockchainNetwork,
    length: 20,
    nullable: true,
  })
  network?: BlockchainNetwork;

  @Column({ length: 50, nullable: true })
  wallet?: string;

  @ManyToOne(() => CharityEntity, (charity) => charity.charityTopics)
  charity: CharityEntity;

  @ManyToOne(() => TopicEntity, (topic) => topic.charityTopics)
  topic: TopicEntity;
}
