import { Injectable } from '@nestjs/common';
import { Video } from './entities/video.entity';
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

  async updateVideo(
    id: number,
    active?: boolean,
    order?: number,
  ): Promise<Video> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM videos WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) reject(err);
          if (!row) reject(new Error('Video not found'));

          const newActive = active ?? row.active === 1;
          const newOrder = order ?? row.order_num;

          this.db.run(
            'UPDATE videos SET active = ?, order_num = ? WHERE id = ?',
            [newActive ? 1 : 0, newOrder, id],
            (err) => {
              if (err) reject(err);
              resolve(this.getVideo(id));
            },
          );
        },
      );
    });
  }

  async deleteVideo(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM videos WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  private async getVideo(id: number): Promise<Video> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM videos WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) reject(err);
          resolve({
            id: row.id,
            filename: row.filename,
            path: row.path,
            order: row.order_num,
            active: row.active === 1,
            createdAt: new Date(row.created_at),
          });
        },
      );
    });
  }
}
