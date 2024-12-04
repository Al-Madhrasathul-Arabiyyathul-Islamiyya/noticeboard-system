import { Module } from '@nestjs/common';
import { VideoController } from './controllers/video.controller';
import { VideoService } from './services/video.service';
import { NoticeboardGateway } from './gateways/noticeboard.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService, NoticeboardGateway],
})
export class AppModule {}
