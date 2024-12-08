import * as fs from 'fs';
import * as path from 'path';

export interface ClientMap {
  name: string;
  ip: string;
}

export function loadClientMap(): ClientMap[] {
  const filePath = path.resolve(process.cwd(), 'client-map.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData).clients;
  } catch (error) {
    console.error(`Error loading client-map.json: ${error.message}`);
    return [];
  }
}
