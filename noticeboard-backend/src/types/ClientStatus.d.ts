interface ClientStatus {
  id: string;
  lastPing: Date;
  ipAddress?: string;
  connected: boolean;
  lastVideoPlayed?: string;
  network: NetworkStatus;
}
