import { Module } from '@nestjs/common';
import { CountdownController } from './countdown.controller';
import { CountdownService } from './countdown.service';
import { WebsocketModule } from '../shared/websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [CountdownController],
  providers: [CountdownService],
})
export class CountdownModule {}
