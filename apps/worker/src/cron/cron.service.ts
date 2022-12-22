import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron('*/15 * * * * *')
  getHello() {
    console.log('Hello World!' + new Date());
  }
}
