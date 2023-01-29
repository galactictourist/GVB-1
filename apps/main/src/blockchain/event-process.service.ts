import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { BlockchainNetwork } from '../types/blockchain';
import { EventProcessEntity } from './entity/event-process.entity';
import { EventProcessRepository } from './repository/event-process.repository';
import { BlockchainEventStatus, ContractStandard } from './types';

@Injectable()
export class EventProcessService {
  constructor(
    private readonly eventProcessRepository: EventProcessRepository,
  ) {}

  async getActiveEntities() {
    const entities = await this.eventProcessRepository.findBy({
      status: BlockchainEventStatus.ACTIVE,
    });

    return entities;
  }

  async getEventProcess(
    network: BlockchainNetwork,
    scAddress: string,
    eventName: string,
    contractStandard: ContractStandard,
  ): Promise<EventProcessEntity | null> {
    const entity = await this.eventProcessRepository.findOneBy({
      network,
      scAddress,
      eventName,
      contractStandard,
    });

    return entity;
  }

  async updateEventProcess(
    id: string,
    lastEndBlockNumber: number | null,
    newEndBlockNumber: number,
  ) {
    return await this.eventProcessRepository.update(
      {
        id,
        endBlockNumber:
          lastEndBlockNumber === null ? IsNull() : lastEndBlockNumber,
      },
      { endBlockNumber: newEndBlockNumber },
    );
  }
}
