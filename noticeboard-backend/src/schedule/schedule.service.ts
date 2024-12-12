import { Injectable } from '@nestjs/common';
import { Schedule } from './entities/schedule.entity';
import * as sqlite3 from 'sqlite3';
import { CreateScheduleDto } from './dto/create-schedule.dto';

interface ScheduleRow {
  id: number;
  type: 'academic' | 'administration';
  date: string;
  time: string;
  item: string;
}

@Injectable()
export class ScheduleService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('noticeboard.db');
    this.initTable();
  }

  private initTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT CHECK(type IN ('academic', 'administration')) NOT NULL,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        item TEXT NOT NULL
      )
    `);
  }

  private mapRow(row: any): Schedule {
    return {
      id: row.id,
      type: row.type,
      date: new Date(row.date),
      time: row.time,
      item: row.item,
    };
  }

  private async getSchedule(id: number): Promise<Schedule> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM schedule WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) reject(err);
          if (!row) reject(new Error('Schedule not found'));
          resolve({
            id: row.id,
            type: row.type,
            date: new Date(row.date),
            time: row.time,
            item: row.item,
          });
        },
      );
    });
  }

  async getTodaySchedule(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM schedule WHERE date = ? ORDER BY time',
        [today],
        (err, rows: any[]) => {
          if (err) reject(err);
          resolve(rows.map(this.mapRow));
        },
      );
    });
  }

  async getSchedules(): Promise<Schedule[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM schedule ORDER BY date, time',
        (err, rows: any[]) => {
          if (err) reject(err);
          resolve(rows.map(this.mapRow));
        },
      );
    });
  }

  async createSchedule(schedule: CreateScheduleDto): Promise<Schedule> {
    return new Promise((resolve, reject) => {
      const db = this.db;
      this.db.run(
        'INSERT INTO schedule (type, date, time, item) VALUES (?, ?, ?, ?)',
        [schedule.type, schedule.date, schedule.time, schedule.item],
        function (err) {
          if (err) reject(err);
          const id = this.lastID;
          db.get(
            'SELECT * FROM schedule WHERE id = ?',
            [id],
            (err, row: ScheduleRow) => {
              if (err) reject(err);
              if (!row) reject(new Error('Created schedule not found'));
              resolve({
                id: row.id,
                type: row.type,
                date: new Date(row.date),
                time: row.time,
                item: row.item,
              });
            },
          );
        },
      );
    });
  }

  async updateSchedule(id: number, data: CreateScheduleDto): Promise<Schedule> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE schedule SET type = ?, date = ?, time = ?, item = ? WHERE id = ?',
        [data.type, data.date, data.time, data.item, id],
        (err) => {
          if (err) reject(err);
          this.getSchedule(id).then(resolve).catch(reject);
        },
      );
    });
  }

  async deleteSchedule(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM schedule WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
