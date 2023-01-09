import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { OrderEntity } from '~/main/marketplace/entity/order.entity';
import { SaleEntity } from '~/main/marketplace/entity/sale.entity';
import { NftEntity } from '~/main/nft/entity/nft.entity';
import { CountryCode } from '~/main/types/country';
import { UserStatus } from '../types';

@Entity({ name: 'user' })
@Index('user_wallet_uq', { synchronize: false }) // https://typeorm.io/indices#disabling-synchronization
@Index('user_status_idx', ['status'])
export class UserEntity extends BaseElement {
  @Column({ nullable: true, length: 50 })
  wallet?: string;

  @Column({ length: 200, nullable: true })
  imageUrl?: string;

  @Column({ nullable: true, length: 100 })
  name?: string;

  @Column({ type: 'varchar', enum: CountryCode, nullable: true, length: 2 })
  countryCode?: CountryCode;

  @OneToMany(() => NftEntity, (nft) => nft.owner)
  nfts: NftEntity[];

  @OneToMany(() => SaleEntity, (sale) => sale.user)
  sales: SaleEntity[];

  @OneToMany(() => OrderEntity, (order) => order.buyer)
  orders: OrderEntity[];

  @Column({
    type: 'varchar',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    length: 20,
  })
  status: UserStatus;

  isActive() {
    return this.status === UserStatus.ACTIVE;
  }
}
