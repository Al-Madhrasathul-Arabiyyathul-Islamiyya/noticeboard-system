import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { Video } from '../../video/entities/video.entity';
import type { Schedule } from '../../schedule/entities/schedule.entity';
import type { Countdown } from '../../countdown/entities/countdown.entity';

interface ClientStatus {
  id: string;
  lastPing: Date;
  ipAddress?: string;
  connected: boolean;
  lastVideoPlayed?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Configure appropriately for production
  },
})
export class NoticeboardGateway {
  private clients: Map<string, ClientStatus> = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const clientId = client.id;
    const status: ClientStatus = {
      id: clientId,
      lastPing: new Date(),
      ipAddress: client.handshake.address,
      connected: true,
    };

    this.clients.set(clientId, status);
    this.broadcastStatus();
  }

  handleDisconnect(client: Socket) {
    const status = this.clients.get(client.id);
    if (status) {
      status.connected = false;
      status.lastPing = new Date();
      this.clients.set(client.id, status);
      this.broadcastStatus();
    }
  }

  // Original emit methods
  emitVideoUpdate(videos: Video[]) {
    this.server.emit('videoUpdate', videos);
  }

  emitScheduleUpdate(schedule: Schedule[]) {
    this.server.emit('scheduleUpdate', schedule);
  }

  emitCountdownUpdate(countdown: Countdown | null) {
    this.server.emit('countdownUpdate', countdown);
  }

  // Status related methods
  @SubscribeMessage('videoUpdate')
  handleVideoUpdate(client: Socket, video: any) {
    const status = this.clients.get(client.id);
    if (status) {
      status.lastVideoPlayed = video.filename;
      this.clients.set(client.id, status);
      this.broadcastStatus();
    }
  }

  private broadcastStatus() {
    this.server.emit('statusUpdate', Array.from(this.clients.values()));
  }
}
