import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure appropriately for production
  },
})
export class NoticeboardGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Client connected: ', client);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected: ', client);
  }

  // Emit updates to connected clients
  emitVideoUpdate(videos: any[]) {
    this.server.emit('videoUpdate', videos);
  }

  emitScheduleUpdate(schedule: any[]) {
    this.server.emit('scheduleUpdate', schedule);
  }

  emitCountdownUpdate(countdown: any) {
    this.server.emit('countdownUpdate', countdown);
  }
}
