import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as sqlite3 from 'sqlite3';

interface DBUser {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  private db: sqlite3.Database;

  constructor(private jwtService: JwtService) {
    this.db = new sqlite3.Database('noticeboard.db');
    this.initTable();
    this.createDefaultUser();
  }

  private initTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);
  }

  private async createDefaultUser() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    this.db.run(
      'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
      ['admin', hashedPassword],
    );
  }

  async validateUser(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, user: DBUser) => {
          if (err) reject(err);
          if (user && (await bcrypt.compare(password, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            resolve(result);
          }
          resolve(null);
        },
      );
    });
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
