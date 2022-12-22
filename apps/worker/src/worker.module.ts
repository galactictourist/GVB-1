import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [ScheduleModule.forRoot(), CronModule],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
