import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configs } from './config';

@Module({
  imports: [ConfigModule.forRoot({ load: configs })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
