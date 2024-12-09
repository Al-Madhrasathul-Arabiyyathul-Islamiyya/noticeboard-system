import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { Video } from '../../video/entities/video.entity';
import type { Schedule } from '../../schedule/entities/schedule.entity';
import type { Countdown } from '../../countdown/entities/countdown.entity';
import { ClientStatus, SystemMetrics } from './types/sockets';
import { ClientMap, loadClientMap, normalizeIP } from 'src/utils/clientMap';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(','),
    credentials: true,
  },
})
export class NoticeboardGateway {
  private clients: Map<string, ClientStatus> = new Map();
  private pingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private clientMap: ClientMap[] = loadClientMap();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const ip = normalizeIP(client.handshake.address);
    const mappedClient = this.clientMap.find((entry) => entry.ip === ip);

    const clientName =
      (client.handshake.query.clientName as string) ||
      mappedClient?.name ||
      `unknown-client-${client.id}`;
    const clientId = clientName;

    const status: ClientStatus = {
      id: clientId,
      lastPing: new Date(),
      ipAddress: ip,
      connected: true,
      network: {
        clientId: clientId,
        latency: 0,
        lastPing: new Date(),
        lastPong: new Date(),
        connectionQuality: 'good',
        lastSync: new Date(),
      },
    };

    this.clients.set(clientId, status);
    this.startPingInterval(client);
    this.broadcastStatus();

    console.log(`Client connected: ${clientName} (IP: ${ip})`);
  }

  handleDisconnect(client: Socket) {
    const ip = normalizeIP(client.handshake.address);
    const mappedClient = this.clientMap.find((entry) => entry.ip === ip);

    const clientName =
      (client.handshake.query?.clientName as string) ||
      mappedClient?.name ||
      `unknown-client-${client.id}`;

    const status = this.clients.get(clientName);
    if (status) {
      status.connected = false;
      this.clients.set(clientName, status);
      this.broadcastStatus();
    }

    console.log(`Client disconnected: ${clientName} (IP: ${ip})`);
  }

  private startPingInterval(client: Socket) {
    this.clearPingInterval(client.id);

    const mappedClientId = this.getMappedClientId(client);
    const interval = setInterval(() => {
      const startTime = Date.now();
      client.removeAllListeners('pong');

      client.once('pong', () => {
        const latency = Date.now() - startTime;
        this.updateNetworkStatus(mappedClientId, latency);
      });

      client.emit('ping', { timestamp: startTime });

      setTimeout(() => {
        const status = this.clients.get(mappedClientId);
        if (status && Date.now() - status.network.lastPong.getTime() > 5000) {
          status.network.connectionQuality = 'poor';
          this.clients.set(mappedClientId, status);
          this.broadcastStatus();
        }
      }, 5000);
    }, 30000);

    this.pingIntervals.set(mappedClientId, interval);
  }

  private clearPingInterval(clientId: string) {
    const interval = this.pingIntervals.get(clientId);
    if (interval) {
      clearInterval(interval);
      this.pingIntervals.delete(clientId);
    }
  }

  private updateNetworkStatus(clientId: string, latency: number) {
    const status = this.clients.get(clientId);
    if (status) {
      status.network.latency = latency;
      status.network.lastPong = new Date();
      status.lastPing = new Date();
      status.network.connectionQuality = this.getConnectionQuality(latency);
      this.clients.set(clientId, status);
      this.broadcastStatus();
    }
  }

  private getConnectionQuality(latency: number): 'good' | 'fair' | 'poor' {
    if (latency < 100) return 'good';
    if (latency < 300) return 'fair';
    return 'poor';
  }

  private getMappedClientId(client: Socket): string {
    const ip = normalizeIP(client.handshake.address);
    const mappedClient = this.clientMap.find((entry) => entry.ip === ip);
    return (
      (client.handshake.query.clientName as string) ||
      mappedClient?.name ||
      `unknown-client-${client.id}`
    );
  }

  @SubscribeMessage('systemMetrics')
  handleSystemMetrics(client: Socket, metrics: SystemMetrics) {
    const status = this.clients.get(client.id);
    if (status) {
      status.system = metrics;
      this.clients.set(client.id, status);
      this.broadcastStatus();
    }
  }

  @SubscribeMessage('videoUpdate')
  handleVideoUpdate(client: Socket, video: { filename: string }) {
    const status = this.clients.get(client.id);
    if (status) {
      status.lastVideoPlayed = video.filename;
      this.clients.set(client.id, status);
      this.broadcastStatus();
    }
  }

  trackSync(clientId: string) {
    const status = this.clients.get(clientId);
    if (status) {
      status.network.lastSync = new Date();
      this.clients.set(clientId, status);
      this.broadcastStatus();
    }
  }

  getConnectedClientsCount(): number {
    return Array.from(this.clients.values()).filter((c) => c.connected).length;
  }

  getClientsStatus(): ClientStatus[] {
    return Array.from(this.clients.values());
  }

  // Event emitters
  emitVideoUpdate(videos: Video[]) {
    this.server.emit('videoUpdate', videos);
  }

  emitScheduleUpdate(schedule: Schedule[]) {
    this.server.emit('scheduleUpdate', schedule);
  }

  emitCountdownUpdate(countdown: Countdown | null) {
    this.server.emit('countdownUpdate', countdown);
  }

  private broadcastStatus() {
    this.server.emit('statusUpdate', Array.from(this.clients.values()));
  }
}
