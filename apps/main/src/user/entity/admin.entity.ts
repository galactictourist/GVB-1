import bcrypt from 'bcrypt';
import { Column, Entity, Index } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { AdminRole, AdminStatus } from '../types';

@Entity({ name: 'admin' })
@Index('admin_username_uq', { synchronize: false }) // https://typeorm.io/indices#disabling-synchronization
export class AdminEntity extends BaseElement {
  @Column({ length: 50 })
  username: string;

  @Column({ length: 200 })
  password: string;

  @Column({ type: 'varchar', enum: AdminRole, length: 20 })
  role: AdminRole;

  @Column({
    type: 'varchar',
    enum: AdminStatus,
    default: AdminStatus.ACTIVE,
    length: 20,
  })
  status: AdminStatus;

  isValidPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  isActive() {
    return this.status === AdminStatus.ACTIVE;
  }
}
