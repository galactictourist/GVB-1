import { Column, Entity, ManyToOne } from 'typeorm';
import { CharityEntity } from '~/charity/entity/charity.entity';
import { TopicEntity } from '~/charity/entity/topic.entity';
import { BaseElement } from '~/lib/database/base-element';
import { NftEntity } from '~/nft/entity/nft.entity';
import { CountryCode } from '~/types/country';
import { BlockchainNetwork } from '../../types/blockchain';
import { UserEntity } from '../../user/entity/user.entity';
import { SaleStatus } from '../types';

@Entity({ name: 'sale' })
export class SaleEntity extends BaseElement {
  @Column('uuid')
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @Column({
    enum: BlockchainNetwork,
    length: 20,
  })
  network: BlockchainNetwork;

  @Column({ length: 50, nullable: true })
  currency?: string;

  @Column({
    type: 'decimal',
    precision: 36,
    scale: 18,
    default: '0',
  })
  price: string;

  @Column('uuid')
  nftId: string;

  @ManyToOne(() => NftEntity, (nft) => nft.id)
  nft: NftEntity;

  @Column('uuid', { nullable: true })
  charityId?: string;

  @ManyToOne(() => CharityEntity, (charity) => charity.sales, {
    nullable: true,
  })
  charity?: CharityEntity;

  @Column('uuid', { nullable: true })
  topicId?: string;

  @ManyToOne(() => TopicEntity, (topic) => topic.sales, { nullable: true })
  topic?: TopicEntity;

  @Column({ enum: CountryCode, length: 2, nullable: true })
  countryCode?: CountryCode;

  @Column('int', { nullable: true })
  charityShare?: number;

  @Column({
    enum: SaleStatus,
    default: SaleStatus.ACTIVE,
    length: 20,
  })
  status: SaleStatus;

  isActive() {
    return this.status === SaleStatus.ACTIVE;
  }
}
