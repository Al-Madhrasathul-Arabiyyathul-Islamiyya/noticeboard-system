export interface ClientMetrics {
  id: string
  lastPing: Date
  ipAddress?: string
  connected: boolean
  lastVideoPlayed?: string
  network: {
    latency: number
    connectionQuality: 'good' | 'fair' | 'poor'
    lastSync: Date
  }
}
