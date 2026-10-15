import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS leads (
     id               INTEGER PRIMARY KEY AUTOINCREMENT,
     code             TEXT    NOT NULL UNIQUE,
     season_id        TEXT    NOT NULL,
     full_name        TEXT    NOT NULL,
     email            TEXT    NOT NULL,
     phone            TEXT,
     segment          TEXT    NOT NULL,
     organization     TEXT    NOT NULL,
     strength         TEXT    NOT NULL,
     project          TEXT,
     motivation       TEXT    NOT NULL,
     mode             TEXT    NOT NULL,
     hours_per_week   INTEGER NOT NULL,
     terms_version    TEXT    NOT NULL,
     privacy_version  TEXT    NOT NULL,
     consented_at     TEXT    NOT NULL,
     source           TEXT,
     ip_hash          TEXT,
     user_agent       TEXT,
     telegram_status  TEXT    NOT NULL DEFAULT 'pending',
     telegram_error   TEXT,
     created_at       TEXT    NOT NULL,
     UNIQUE (email, season_id)
   )`,
  `CREATE TABLE IF NOT EXISTS audit_log (
     id          INTEGER PRIMARY KEY AUTOINCREMENT,
     actor       TEXT NOT NULL,
     action      TEXT NOT NULL,
     object_type TEXT NOT NULL,
     object_id   TEXT,
     detail      TEXT,
     created_at  TEXT NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at)`,
];

// Cột thêm sau lần tạo bảng đầu tiên; SQLite không có ADD COLUMN IF NOT EXISTS nên kiểm tra trước
const COLUMNS = [['leads', 'segment_other', 'TEXT']];

export function openDb(file) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 3000;');
  for (const sql of MIGRATIONS) db.exec(sql);
  for (const [table, col, type] of COLUMNS) {
    const has = db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === col);
    if (!has) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
  }
  return db;
}

export function audit(db, { actor, action, objectType, objectId = null, detail = null }) {
  db.prepare(
    `INSERT INTO audit_log (actor, action, object_type, object_id, detail, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(actor, action, objectType, objectId, detail ? JSON.stringify(detail) : null, new Date().toISOString());
}
