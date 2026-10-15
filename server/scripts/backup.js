import './_env.js';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config, ROOT_DIR } from '../src/config.js';

// Sao lưu đồng bộ database + private-files vào backups/<thời điểm>/
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const dest = path.join(ROOT_DIR, 'backups', stamp);
fs.mkdirSync(dest, { recursive: true });

if (fs.existsSync(config.dbFile)) {
  const db = new DatabaseSync(config.dbFile);
  db.exec(`VACUUM INTO '${path.join(dest, 'go4ai.sqlite').replace(/'/g, "''")}'`);
  db.close();
}
if (fs.existsSync(config.privateFilesDir)) {
  fs.cpSync(config.privateFilesDir, path.join(dest, 'private-files'), { recursive: true });
}
console.log(`Đã sao lưu vào ${dest}`);
