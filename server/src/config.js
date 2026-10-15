import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(here, '..', '..');

export const config = {
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 8787),
  seasonId: process.env.SEASON_ID || 'ftc-2026',
  // 23:59:59 30/11/2026 GMT+7 lưu theo UTC
  registrationClosesAt: process.env.REGISTRATION_CLOSES_AT || '2026-11-30T16:59:59Z',
  termsVersion: 'the-le-ftc-2026-v1',
  privacyVersion: 'xu-ly-du-lieu-ftc-2026-v1',
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },
  adminToken: process.env.ADMIN_TOKEN || '',
  ipHashSalt: process.env.IP_HASH_SALT || 'go4ai-local',
  dbFile: process.env.DB_FILE || path.join(ROOT_DIR, 'data', 'go4ai.sqlite'),
  privateFilesDir: path.join(ROOT_DIR, 'private-files'),
  frontendDist: path.join(ROOT_DIR, 'frontend', 'dist'),
};
