import * as fs from 'fs';
import * as path from 'path';

export interface ClientMap {
  name: string;
  ip: string;
}

export function loadClientMap(): ClientMap[] {
  const filePath = path.resolve(process.cwd(), 'clients-map.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const clients = JSON.parse(rawData).clients;
    return clients.map((client: ClientMap) => ({
      ...client,
      ip: normalizeIP(client.ip),
    }));
  } catch (error) {
    console.error(`Error loading client-map.json: ${error.message}`);
    return [];
  }
}

export function normalizeIP(ip: string): string {
  if (ip === '::1') return '127.0.0.1';
  if (ip.startsWith('::ffff:')) return ip.substring(7);
  return ip;
}
