import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlockchainNetwork } from '../../types/blockchain';
import { NftStatus } from '../types';

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

  // @ManyToOne(() => CollectionEntity)
  // collection: CollectionEntity;

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
