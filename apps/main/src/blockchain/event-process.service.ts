import { Injectable } from '@nestjs/common';
import { EventProcessRepository } from './repository/event-process.repository';
import { BlockchainEventStatus } from './types';

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
}
