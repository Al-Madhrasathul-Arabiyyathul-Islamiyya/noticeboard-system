import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CountdownModule } from './countdown/countdown.module';
import { WebsocketModule } from './shared/websocket/websocket.module';
import { VideoModule } from './video/video.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    CountdownModule,
    ScheduleModule,
    WebsocketModule,
    VideoModule,
  ],
})
export class AppModule {}
