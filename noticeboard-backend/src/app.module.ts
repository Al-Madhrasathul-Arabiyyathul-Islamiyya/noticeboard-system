import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CountdownModule } from './countdown/countdown.module';
import { WebsocketModule } from './shared/websocket/websocket.module';
import { VideoModule } from './video/video.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CountdownModule,
    ScheduleModule,
    WebsocketModule,
    VideoModule,
  ],
})
export class AppModule {}
