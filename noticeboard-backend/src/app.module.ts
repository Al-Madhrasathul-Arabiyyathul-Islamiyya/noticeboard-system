import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { WebsocketModule } from './shared/websocket/websocket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    VideoModule,
    WebsocketModule,
  ],
})
export class AppModule {}
