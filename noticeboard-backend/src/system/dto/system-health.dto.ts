import { ApiProperty } from '@nestjs/swagger';

export class SystemHealthDto {
  @ApiProperty({ description: 'System uptime in seconds' })
  uptime: number;

  @ApiProperty({ description: 'Storage space used in bytes' })
  storageUsed: number;

  @ApiProperty({ description: 'Available storage space in bytes' })
  storageAvailable: number;

  @ApiProperty({ description: 'Total number of videos in the system' })
  totalVideos: number;

  @ApiProperty({ description: 'Number of active videos' })
  activeVideos: number;

  @ApiProperty({ description: 'Number of active schedules for today' })
  activeSchedules: number;

  @ApiProperty({ description: 'Whether there is an active countdown' })
  activeCountdown: boolean;

  @ApiProperty({ description: 'Last time the health status was updated' })
  lastUpdated: Date;

  @ApiProperty({ description: 'Number of orphaned video files' })
  orphanedFiles: number;

  @ApiProperty({ description: 'Space used by orphaned files in bytes' })
  orphanedSpace: number;

  @ApiProperty({ description: 'Total storage space in bytes' })
  totalStorage: number;

  @ApiProperty({ description: 'CPU usage percentage' })
  cpuUsage: number;

  @ApiProperty({ description: 'Memory usage in bytes' })
  memoryUsed: number;

  @ApiProperty({ description: 'Total memory in bytes' })
  totalMemory: number;

  @ApiProperty({ description: 'System load averages' })
  loadAverage: number;
}
