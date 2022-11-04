import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CollectionStatus } from '../types';

@Entity({ schema: 'nft', name: 'collection' })
export class CollectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 200 })
  name: string;

  // @ManyToOne(() => UserEntity)
  // owner: UserEntity;

  @Column({
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
    length: 20,
  })
  status: CollectionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isPublished() {
    return this.status === CollectionStatus.PUBLISHED;
  }
}
