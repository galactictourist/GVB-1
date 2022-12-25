import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { TypedData } from '~/main/blockchain/types';
import { CharityEntity } from '~/main/charity/entity/charity.entity';
import { TopicEntity } from '~/main/charity/entity/topic.entity';
import { BaseElement } from '~/main/lib/database/base-element';
import { NftEntity } from '~/main/nft/entity/nft.entity';
import { CountryCode } from '~/main/types/country';
import {
  BlockchainNetwork,
  CryptoCurrency,
  mulCryptoAmount,
} from '../../types/blockchain';
import { UserEntity } from '../../user/entity/user.entity';
import { SaleStatus } from '../types';

@Entity({ name: 'sale' })
@Index('sale_uq', { synchronize: false }) // https://typeorm.io/indices#disabling-synchronization
@Index('sale_userId_idx', ['userId'])
@Index('sale_nftId_idx', ['nftId'])
@Index('sale_charityId_idx', ['charityId'])
@Index('sale_topicId_idx', ['topicId'])
@Index('sale_expiredAt_idx', ['expiredAt'])
@Index('sale_status_idx', ['status'])
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

  @Column({ length: 50 })
  currency: CryptoCurrency;

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

  @Column({ length: 50, nullable: true })
  charityWallet?: string;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('int', { default: 1 })
  remainingQuantity: number;

  @Column('int', { nullable: true })
  charityShare?: number;

  @Column('timestamp', { nullable: true })
  expiredAt?: Date;

  @Column({
    enum: SaleStatus,
    default: SaleStatus.LISTING,
    length: 20,
  })
  status: SaleStatus;

  @Column({ unique: true, length: 100, nullable: true })
  hash: string;

  @Column('jsonb', { nullable: true })
  signedData: TypedData;

  @Column({ length: 200, nullable: true })
  signature: string;

  isListing() {
    return this.status === SaleStatus.LISTING;
  }

  calculateTotalAmount(quantity: number): string {
    return mulCryptoAmount(this.network, this.currency, this.price, quantity);
  }
}
