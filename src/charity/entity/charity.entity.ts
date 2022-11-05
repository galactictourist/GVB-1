import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CharityStatus } from '../types';

@Entity({ schema: 'charity', name: 'charity' })
export class CharityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isActive() {
    return this.status === CharityStatus.ACTIVE;
  }
}
