import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as si from 'systeminformation';
import { VideoService } from '../video/video.service';
import { ScheduleService } from '../schedule/schedule.service';
import { CountdownService } from '../countdown/countdown.service';
import type { SystemHealthDto } from './dto/system-health.dto';
import { StorageStats } from '../types/StorageStats';
import { NoticeboardGateway } from 'src/shared/websocket/noticeboard.gateway';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

@Injectable()
export class SystemService {
  constructor(
    private videoService: VideoService,
    private scheduleService: ScheduleService,
    private countdownService: CountdownService,
    private readonly noticeboardGateway: NoticeboardGateway,
  ) {
    setInterval(() => this.broadcastSystemStatus(), 30000);
  }

  private async broadcastSystemStatus() {
    const health = await this.getSystemHealth();
    this.noticeboardGateway.server.emit('systemStatus', {
      ...health,
      connectedClients: this.noticeboardGateway.getConnectedClientsCount(),
      clientsStatus: this.noticeboardGateway.getClientsStatus(),
    });
  }

  async getSystemHealth(): Promise<SystemHealthDto> {
    const [
      storageInfo,
      videoStats,
      hasActiveCountdown,
      activeSchedules,
      orphanStats,
      cpuData,
      memData,
      loadData,
    ] = await Promise.all([
      this.getStorageInfo(),
      this.getVideoStats(),
      this.countdownService.getActiveCountdown(),
      this.scheduleService.getTodaySchedule(),
      this.getOrphanStats(),
      si.currentLoad(),
      si.mem(),
      si.currentLoad(),
    ]);

    return {
      uptime: process.uptime(),
      ...storageInfo,
      ...videoStats,
      activeSchedules: activeSchedules.length,
      activeCountdown: !!hasActiveCountdown,
      orphanedFiles: orphanStats.totalOrphaned,
      orphanedSpace: orphanStats.orphanedSpace,
      cpuUsage: cpuData.currentLoad,
      memoryUsed: memData.active,
      totalMemory: memData.total,
      loadAverage: loadData.avgLoad,
      lastUpdated: new Date(),
    };
  }

  private async getStorageInfo() {
    const uploadsPath = path.join(process.cwd(), 'uploads');
    let storageUsed = 0;

    try {
      const files = await readdirAsync(uploadsPath);
      const sizes = await Promise.all(
        files.map(async (file) => {
          const stats = await statAsync(path.join(uploadsPath, file));
          return stats.size;
        }),
      );
      storageUsed = sizes.reduce((acc, size) => acc + size, 0);

      const fsSize = await si.fsSize();
      const fs = fsSize.find((fs) => uploadsPath.startsWith(fs.mount));

      if (!fs) {
        throw new Error(
          'Could not determine filesystem info for uploads directory',
        );
      }

      return {
        storageUsed,
        storageAvailable: fs.available,
        totalStorage: fs.size,
      };
    } catch (error) {
      console.error('Error calculating storage:', error);
      return {
        storageUsed,
        storageAvailable: 0,
        totalStorage: 0,
      };
    }
  }

  private async getVideoStats() {
    const [allVideos, activeVideos] = await Promise.all([
      this.videoService.getVideos(),
      this.videoService.getActiveVideos(),
    ]);

    return {
      totalVideos: allVideos.length,
      activeVideos: activeVideos.length,
    };
  }

  async getOrphanStats(): Promise<StorageStats> {
    const uploadsPath = path.join(process.cwd(), 'uploads');
    const diskFiles = await readdirAsync(uploadsPath);
    const dbVideos = await this.videoService.getVideos();
    const dbFilenames = dbVideos.map((v) => v.path);

    const orphanFiles = diskFiles.filter((f) => !dbFilenames.includes(f));
    const missingFiles = dbFilenames.filter((f) => !diskFiles.includes(f));

    const orphanedSpace = await this.calculateOrphanSize(orphanFiles);

    return {
      orphanFiles,
      missingFiles,
      totalOrphaned: orphanFiles.length,
      orphanedSpace,
    };
  }

  async cleanupOrphans(): Promise<number> {
    const { orphanFiles } = await this.getOrphanStats();
    for (const file of orphanFiles) {
      await fs.promises.unlink(path.join(process.cwd(), 'uploads', file));
    }
    return orphanFiles.length;
  }

  private async calculateOrphanSize(files: string[]): Promise<number> {
    const uploadsPath = path.join(process.cwd(), 'uploads');
    let totalSize = 0;

    for (const file of files) {
      try {
        const stats = await statAsync(path.join(uploadsPath, file));
        totalSize += stats.size;
      } catch (error) {
        console.error(`Error calculating size for ${file}:`, error);
      }
    }

    return totalSize;
  }
}
