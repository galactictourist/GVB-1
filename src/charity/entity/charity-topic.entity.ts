import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlockchainNetwork } from '../../types/blockchain';
import { CharityEntity } from './charity.entity';
import { TopicEntity } from './topic.entity';

@Entity({ schema: 'charity', name: 'charity_topic' })
export class CharityTopicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  charityId: string;

  @Column('uuid')
  topicId: string;

  @Column()
  countryCode: string;

  @Column({
    enum: BlockchainNetwork,
    length: 20,
    nullable: true,
  })
  network: string;

  @Column({ nullable: true })
  wallet: string;

  @ManyToOne(() => CharityEntity, (charity) => charity.id)
  charity: CharityEntity;

  @ManyToOne(() => TopicEntity, (topic) => topic.id)
  topic: TopicEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
