import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Nạp ../.env cho các script chạy trực tiếp bằng `node`
const envFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
