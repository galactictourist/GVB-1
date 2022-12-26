import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventProcessService } from '~/main/blockchain/event-process.service';

@Injectable()
export class CronService {
  constructor(private readonly eventProcessService: EventProcessService) {}

  @Cron('*/15 * * * * *')
  async processEvents() {
    console.log('Running at', new Date());
    const activeEvents = await this.eventProcessService.getActiveEntities();
    console.log('activeEvents', activeEvents);
  }
}
