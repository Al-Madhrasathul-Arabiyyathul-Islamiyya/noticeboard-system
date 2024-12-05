import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
