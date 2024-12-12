interface NetworkStatus {
  clientId: string;
  latency: number; // in ms
  lastPing: Date;
  lastPong: Date;
  connectionQuality: 'good' | 'fair' | 'poor';
  lastSync: Date;
}
