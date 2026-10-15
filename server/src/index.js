import fs from 'node:fs';
import { createApp } from './app.js';
import { config } from './config.js';
import { openDb } from './db.js';
import { createTelegramNotifier } from './telegram.js';

fs.mkdirSync(config.privateFilesDir, { recursive: true });
const db = openDb(config.dbFile);
const notifier = createTelegramNotifier(config.telegram);
const app = createApp({ db, notifier, config });

const server = app.listen(config.port, config.host, () => {
  console.log(`[go4ai] API chạy tại http://${config.host}:${config.port}`);
  console.log(`[go4ai] Database: ${config.dbFile}`);
  console.log(`[go4ai] Telegram: ${notifier.enabled ? 'đã cấu hình' : 'CHƯA cấu hình (lead vẫn được lưu)'}`);
});

const shutdown = () => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
