import './_env.js';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config, ROOT_DIR } from '../src/config.js';

const db = new DatabaseSync(config.dbFile, { readOnly: true });
const rows = db.prepare('SELECT * FROM leads ORDER BY id').all();
db.close();

const cols = ['code', 'created_at', 'full_name', 'email', 'phone', 'segment', 'segment_other', 'organization', 'strength', 'mode',
  'hours_per_week', 'motivation', 'project', 'source', 'telegram_status'];
const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csv = '﻿' + [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\r\n');

const dir = path.join(ROOT_DIR, 'data', 'exports');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `leads-${new Date().toISOString().slice(0, 10)}.csv`);
fs.writeFileSync(file, csv);
console.log(`Đã xuất ${rows.length} lead vào ${file}`);
