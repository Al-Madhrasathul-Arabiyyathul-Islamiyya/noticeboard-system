export interface SocketConnection {
  socket: Ref<Socket | null>
  connected: Ref<boolean>
  isReady: Ref<boolean>
  networkQuality: Ref<'good' | 'fair' | 'poor'>
  initialize: () => void
  cleanup: () => void
}
