import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { VideoModule } from '../video/video.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { CountdownModule } from '../countdown/countdown.module';
import { WebsocketModule } from 'src/shared/websocket/websocket.module';

@Module({
  imports: [VideoModule, ScheduleModule, CountdownModule, WebsocketModule],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
