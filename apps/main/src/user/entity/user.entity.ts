import { Column, Entity } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { CountryCode } from '~/main/types/country';
import { UserStatus } from '../types';

@Entity({ name: 'user' })
export class UserEntity extends BaseElement {
  @Column({ nullable: true, length: 50 })
  wallet?: string;

  @Column({ length: 200, nullable: true })
  imageUrl?: string;

  @Column({ nullable: true, length: 100 })
  name?: string;

  @Column({ enum: CountryCode, nullable: true, length: 2 })
  countryCode?: CountryCode;

  @Column({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    length: 20,
  })
  status: UserStatus;

  isActive() {
    return this.status === UserStatus.ACTIVE;
  }
}
