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
  public charityId: string;

  @Column('uuid')
  public topicId: string;

  @Column()
  public countryCode: string;

  @Column({
    enum: BlockchainNetwork,
    length: 20,
    nullable: true,
  })
  public network: string;

  @Column({ nullable: true })
  public wallet: string;

  @ManyToOne(() => CharityEntity, (charity) => charity.id)
  public charity: CharityEntity;

  @ManyToOne(() => TopicEntity, (topic) => topic.id)
  public topic: TopicEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
