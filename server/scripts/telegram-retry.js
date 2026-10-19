import './_env.js';
import { createTelegramNotifier } from '../src/telegram.js';
import { openDb } from '../src/db.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error('Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong .env');
  process.exit(1);
}

const notifier = createTelegramNotifier({ token, chatId });

const dbPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'data', 'leads.sqlite');
const db = openDb(dbPath);

const pending = db
  .prepare("SELECT * FROM leads WHERE telegram_status IN ('failed', 'pending') ORDER BY id ASC")
  .all();

console.log(`Tìm thấy ${pending.length} lead cần gửi lại.`);

let success = 0;
let failed = 0;

for (const row of pending) {
  const lead = {
    id: row.id,
    code: row.code,
    seasonId: row.season_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    segment: row.segment,
    segmentOther: row.segment_other,
    organization: row.organization,
    strength: row.strength,
    project: row.project,
    motivation: row.motivation,
    mode: row.mode,
    hoursPerWeek: row.hours_per_week,
    source: row.source,
    createdAt: row.created_at,
  };

  const res = await notifier.notifyLead(lead);
  const status = res.ok ? 'sent' : 'failed';
  db.prepare('UPDATE leads SET telegram_status = ?, telegram_error = ? WHERE id = ?').run(
    status,
    res.ok ? null : String(res.error).slice(0, 300),
    row.id
  );

  if (res.ok) {
    success++;
    console.log(`[OK] Đã gửi lead ${lead.code} (${lead.email})`);
  } else {
    failed++;
    console.error(`[ERR] Gửi lead ${lead.code} thất bại: ${res.error}`);
  }
}

console.log(`Hoàn tất: ${success} thành công, ${failed} thất bại.`);
db.close();
