import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { CharityEntity } from '~/main/charity/entity/charity.entity';
import { TopicEntity } from '~/main/charity/entity/topic.entity';
import { BaseElement } from '~/main/lib/database/base-element';
import { NftEntity } from '~/main/nft/entity/nft.entity';
import { BlockchainNetwork } from '~/main/types/blockchain';
import { CountryCode } from '~/main/types/country';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderStatus } from '../types';
import { SaleEntity } from './sale.entity';

@Entity({ name: 'order' })
@Unique('order_uq', ['network', 'txId'])
@Index('order_sellerId_idx', ['sellerId'])
@Index('order_buyerId_idx', ['buyerId'])
@Index('order_saleId_idx', ['saleId'])
@Index('order_nftId_idx', ['nftId'])
@Index('order_charityId_idx', ['charityId'])
@Index('order_topicId_idx', ['topicId'])
@Index('order_status_idx', ['status'])
export class OrderEntity extends BaseElement {
  @Column('uuid')
  sellerId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  seller: UserEntity;

  @Column('uuid')
  buyerId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  buyer: UserEntity;

  @Column('uuid')
  saleId: string;

  @ManyToOne(() => SaleEntity, (sale) => sale.id)
  sale: SaleEntity;

  @Column('uuid')
  nftId: string;

  @ManyToOne(() => NftEntity, (nft) => nft.id)
  nft: NftEntity;

  @Column('int')
  quantity: number;

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

  @Column({
    type: 'decimal',
    precision: 36,
    scale: 18,
    default: '0',
  })
  total: string;

  @Column({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    length: 20,
  })
  status: OrderStatus;

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

  @Column({ length: 50, nullable: true })
  charityWallet?: string;

  @Column({ length: 66, nullable: true })
  txId?: string;
}
