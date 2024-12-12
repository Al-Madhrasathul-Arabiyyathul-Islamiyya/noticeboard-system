export interface ClientMetrics {
  clientId: string;
  lastPing: Date;
  ipAddress?: string;
  connected: boolean;
  currentVideo?: string;
  network: {
    latency: number;
    connectionQuality: 'good' | 'fair' | 'poor';
    lastSync: Date;
  };
  system?: {
    memoryUsage: number;
    cpuUsage: number;
  };
}

export interface NetworkStatus {
  clientId: string;
  latency: number;
  lastPing: Date;
  lastPong: Date;
  connectionQuality: 'good' | 'fair' | 'poor';
  lastSync: Date;
}

export interface SystemMetrics {
  memoryUsage: number;
  cpuUsage: number;
  timestamp: Date;
}

export interface ClientStatus {
  id: string;
  lastPing: Date;
  ipAddress?: string;
  connected: boolean;
  lastVideoPlayed?: string;
  network: NetworkStatus;
  system?: SystemMetrics;
}
