import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CountdownModule } from './countdown/countdown.module';
import { WebsocketModule } from './shared/websocket/websocket.module';
import { VideoModule } from './video/video.module';
import { ScheduleModule } from './schedule/schedule.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CountdownModule,
    ScheduleModule,
    SystemModule,
    WebsocketModule,
    VideoModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
