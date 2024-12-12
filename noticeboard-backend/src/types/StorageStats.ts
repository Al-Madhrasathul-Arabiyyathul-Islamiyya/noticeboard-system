export interface StorageStats {
  orphanFiles: string[];
  missingFiles: string[];
  totalOrphaned: number;
  orphanedSpace: number;
}
