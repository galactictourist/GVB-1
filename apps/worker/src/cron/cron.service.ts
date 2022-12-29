import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { EventProcessService } from '~/main/blockchain/event-process.service';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly eventProcessService: EventProcessService,
  ) {}

  @Cron('*/15 * * * * *', { name: 'processEvents' })
  async processEvents() {
    console.log('Running at', new Date());
    const job = this.schedulerRegistry.getCronJob('processEvents');
    console.log('last date', job.lastDate());
    const activeEvents = await this.eventProcessService.getActiveEntities();
    console.log('activeEvents', activeEvents);
  }
}
