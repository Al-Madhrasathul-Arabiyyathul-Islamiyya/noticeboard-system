import { Module } from '@nestjs/common';
import { NoticeboardGateway } from './noticeboard.gateway';

@Module({
  providers: [NoticeboardGateway],
  exports: [NoticeboardGateway],
})
export class WebsocketModule {}
