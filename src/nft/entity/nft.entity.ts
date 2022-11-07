import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlockchainNetwork } from '../../types/blockchain';
import { UserEntity } from '../../user/entity/user.entity';
import { NftStatus } from '../types';
import { CollectionEntity } from './collection.entity';

@Entity({ schema: 'nft', name: 'nft' })
export class NftEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    enum: BlockchainNetwork,
    length: 20,
  })
  network: string;

  @Column({
    length: 50,
  })
  scAddress: string;

  @Column({
    length: 200,
  })
  tokenId: string;

  @ManyToOne(() => CollectionEntity, (collection) => collection.id)
  collection: CollectionEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  owner: UserEntity;

  @Column({
    enum: NftStatus,
    default: NftStatus.ACTIVE,
    length: 20,
  })
  status: NftStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isActive() {
    return this.status === NftStatus.ACTIVE;
  }
}
