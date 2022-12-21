import { Column, Entity, OneToMany } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { SaleEntity } from '~/main/marketplace/entity/sale.entity';
import { CharityStatus } from '../types';
import { CharityTopicEntity } from './charity-topic.entity';

@Entity({ name: 'charity' })
export class CharityEntity extends BaseElement {
  @Column({
    length: 200,
  })
  name: string;

  @Column({
    enum: CharityStatus,
    default: CharityStatus.ACTIVE,
    length: 20,
  })
  status: CharityStatus;

  @OneToMany(() => CharityTopicEntity, (charityTopic) => charityTopic.charity)
  charityTopics: CharityTopicEntity[];

  @OneToMany(() => SaleEntity, (nft) => nft.charity)
  sales: SaleEntity[];

  isActive() {
    return this.status === CharityStatus.ACTIVE;
  }
}
