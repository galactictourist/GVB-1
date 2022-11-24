import { Column, Entity, ManyToOne } from 'typeorm';
import { CharityEntity } from '~/charity/entity/charity.entity';
import { TopicEntity } from '~/charity/entity/topic.entity';
import { BaseElement } from '~/lib/database/base-element';
import { NftEntity } from '~/nft/entity/nft.entity';
import { BlockchainNetwork } from '~/types/blockchain';
import { CountryCode } from '~/types/country';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderStatus } from '../types';
import { SaleEntity } from './sale.entity';

@Entity({ name: 'order' })
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
    default: OrderStatus.PLACED,
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
