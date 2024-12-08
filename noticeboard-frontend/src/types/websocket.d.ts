interface SocketConnection {
  socket: Ref<Socket | null>
  connected: Ref<boolean>
  isReady: Ref<boolean>
  networkQuality: Ref<'good' | 'fair' | 'poor'>
  initialize: () => void
}

interface ClientStatus {
  id: string
  lastPing: Date
  ipAddress?: string
  connected: boolean
  lastVideoPlayed?: string
  network: NetworkStatus
  system?: SystemMetrics
}
