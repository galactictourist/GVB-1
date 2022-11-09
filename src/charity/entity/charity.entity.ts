import { Column, Entity, OneToMany } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';
import { NftEntity } from '~/nft/entity/nft.entity';
import { CharityStatus } from '../types';
import { CharityTopicEntity } from './charity-topic.entity';

@Entity({ schema: 'charity', name: 'charity' })
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

  @OneToMany(() => NftEntity, (nft) => nft.charity)
  nfts: NftEntity[];

  isActive() {
    return this.status === CharityStatus.ACTIVE;
  }
}
