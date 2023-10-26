import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { SaleEntity } from '~/main/marketplace/entity/sale.entity';

@Entity({ name: 'batch' })
@Index('batch_collectionId_idx', ['collectionId'])
@Index('batch_charityId_idx', ['charityId'])
export class BatchEntity extends BaseElement {
  @Column('uuid')
  collectionId: string;

  @Column('uuid')
  charityId: string;

  @Column('int')
  charityShare: number;

  @OneToMany(() => SaleEntity, (saleEntity) => saleEntity.batch, {
    cascade: true,
  })
  nfts: SaleEntity[];
}
