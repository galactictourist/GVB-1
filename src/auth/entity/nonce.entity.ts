import { Column, Entity } from 'typeorm';
import { BaseElement } from '~/lib/database/base-element';

@Entity({ name: 'nonce' })
export class NonceEntity extends BaseElement {
  @Column({ length: 100, unique: true })
  code: string;

  @Column('text')
  data: string;

  @Column({ nullable: true })
  expiredAt?: Date;
}
