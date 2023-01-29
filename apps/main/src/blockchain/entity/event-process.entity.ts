import { Column, Entity, Unique } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { BlockchainNetwork } from '../../types/blockchain';
import { BlockchainEventStatus, ContractStandard } from '../types';

@Entity({ name: 'event_process' })
@Unique('event_process_uq', ['network', 'scAddress', 'eventName'])
export class EventProcessEntity extends BaseElement {
  @Column({
    type: 'varchar',
    enum: BlockchainNetwork,
    length: 20,
  })
  network: BlockchainNetwork;

  @Column({
    length: 50,
  })
  scAddress: string;

  @Column({ length: 50 })
  eventName: string;

  @Column({ type: 'varchar', length: 50, enum: ContractStandard })
  contractStandard: ContractStandard;

  @Column('int', { nullable: true })
  beginBlockNumber?: number;

  @Column('int', { nullable: true })
  endBlockNumber: number | null;

  @Column({
    type: 'varchar',
    enum: BlockchainEventStatus,
    length: 20,
  })
  status: BlockchainEventStatus;

  isActive() {
    return this.status === BlockchainEventStatus.ACTIVE;
  }
}
