export interface SystemHealth {
  uptime: number
  storageUsed: number
  storageAvailable: number
  totalStorage: number
  totalVideos: number
  activeVideos: number
  activeSchedules: number
  activeCountdown: boolean
  orphanedFiles: number
  orphanedSpace: number
  cpuUsage: number
  memoryUsed: number
  totalMemory: number
  loadAverage: number
  lastUpdated: string
}
