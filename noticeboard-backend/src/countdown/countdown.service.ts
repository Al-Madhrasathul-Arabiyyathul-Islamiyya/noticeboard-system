import { Injectable } from '@nestjs/common';
import { Countdown } from './entities/countdown.entity';
import * as sqlite3 from 'sqlite3';

@Injectable()
export class CountdownService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('noticeboard.db');
    this.initTable();
  }

  private initTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS countdown (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target_date DATETIME NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 0
      )
    `);
  }

  async getActiveCountdown(): Promise<Countdown | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM countdown WHERE active = 1',
        (err, row: any) => {
          if (err) reject(err);
          if (!row) return resolve(null); // Early return if no row found
          resolve({
            id: row.id,
            name: row.name,
            targetDate: new Date(row.target_date),
            active: row.active === 1,
          });
        },
      );
    });
  }

  async getAllCountdowns(): Promise<Countdown[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM countdown ORDER BY target_date DESC',
        (err, rows: any[]) => {
          if (err) reject(err);
          resolve(
            rows.map((row) => ({
              id: row.id,
              name: row.name,
              targetDate: new Date(row.target_date),
              active: row.active === 1,
            })),
          );
        },
      );
    });
  }

  async createCountdown(name: string, targetDate: Date): Promise<Countdown> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO countdown (name, target_date) VALUES (?, ?)',
        [name, targetDate.toISOString()],
        function (err) {
          if (err) reject(err);
          resolve({
            id: this.lastID,
            name,
            targetDate,
            active: false,
          });
        },
      );
    });
  }

  async updateCountdown(
    id: number,
    data: { name?: string; targetDate?: Date; active?: boolean },
  ): Promise<Countdown> {
    const current = await this.getCountdown(id);
    if (!current) throw new Error('Countdown not found');

    if (data.active) {
      await this.deactivateAll();
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE countdown SET name = ?, target_date = ?, active = ? WHERE id = ?',
        [
          data.name ?? current.name,
          data.targetDate?.toISOString() ?? current.targetDate.toISOString(),
          (data.active ?? current.active) ? 1 : 0,
          id,
        ],
        (err) => {
          if (err) reject(err);
          resolve(this.getCountdown(id));
        },
      );
    });
  }

  private async deactivateAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE countdown SET active = 0', (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  private async getCountdown(id: number): Promise<Countdown | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM countdown WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) reject(err);
          if (!row) resolve(null);
          resolve({
            id: row.id,
            name: row.name,
            targetDate: new Date(row.target_date),
            active: row.active === 1,
          });
        },
      );
    });
  }

  async deleteCountdown(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM countdown WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
