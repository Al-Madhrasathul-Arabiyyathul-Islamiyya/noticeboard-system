import { Injectable } from '@nestjs/common';
import { Video } from '../entities/video.entity';
import * as sqlite3 from 'sqlite3';

@Injectable()
export class VideoService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('noticeboard.db');
    this.initTable();
  }

  private initTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        path TEXT NOT NULL,
        order_num INTEGER NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async getActiveVideos(): Promise<Video[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM videos WHERE active = 1 ORDER BY order_num ASC',
        (err, rows: any[]) => {
          if (err) reject(err);
          resolve(
            rows.map((row) => ({
              id: row.id,
              filename: row.filename,
              path: row.path,
              order: row.order_num,
              active: row.active === 1,
              createdAt: new Date(row.created_at),
            })),
          );
        },
      );
    });
  }

  async addVideo(filename: string, path: string): Promise<Video> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO videos (filename, path, order_num) VALUES (?, ?, (SELECT COALESCE(MAX(order_num), 0) + 1 FROM videos))',
        [filename, path],
        function (err) {
          if (err) reject(err);
          resolve({
            id: this.lastID,
            filename,
            path,
            order: this.lastID,
            active: true,
            createdAt: new Date(),
          });
        },
      );
    });
  }
}
