import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { audit } from './db.js';
import { validateLead } from './validate.js';

function createRateLimiter({ windowMs, max }) {
  const hits = new Map();
  return (key, nowMs) => {
    const list = (hits.get(key) || []).filter((t) => nowMs - t < windowMs);
    list.push(nowMs);
    hits.set(key, list);
    return list.length <= max;
  };
}

const newCode = () => `FTC26-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

const rowToLead = (r) => ({
  id: r.id,
  code: r.code,
  seasonId: r.season_id,
  fullName: r.full_name,
  email: r.email,
  phone: r.phone,
  segment: r.segment,
  segmentOther: r.segment_other,
  organization: r.organization,
  strength: r.strength,
  project: r.project,
  motivation: r.motivation,
  mode: r.mode,
  hoursPerWeek: r.hours_per_week,
  source: r.source,
  telegramStatus: r.telegram_status,
  telegramError: r.telegram_error,
  createdAt: r.created_at,
});

/**
 * @param {{ db, notifier, config, now?: () => Date }} deps
 */
export function createApp({ db, notifier, config, now = () => new Date() }) {
  const app = express();
  const allow = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });
  app.locals.pending = new Set();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
    });
    next();
  });

  app.get('/api/health', (req, res) => res.json({ ok: true, time: now().toISOString() }));

  // Thông tin mùa công khai: thời điểm máy chủ quyết định mở/đóng (mở ≤ now < đóng)
  app.get('/api/season', (req, res) => {
    const closesAt = new Date(config.registrationClosesAt);
    res.json({
      seasonId: config.seasonId,
      registrationClosesAt: closesAt.toISOString(),
      registrationOpen: now() < closesAt,
      serverTime: now().toISOString(),
      termsVersion: config.termsVersion,
      privacyVersion: config.privacyVersion,
    });
  });

  app.post('/api/leads', (req, res) => {
    const nowDate = now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // Honeypot: bot điền trường ẩn → trả thành công giả, không lưu
    if (req.body?.website) return res.status(201).json({ ok: true, code: newCode(), createdAt: nowDate.toISOString() });

    if (!allow(ip, nowDate.getTime())) {
      return res.status(429).json({ ok: false, message: 'Bạn gửi quá nhiều lần. Vui lòng thử lại sau ít phút.' });
    }
    if (nowDate >= new Date(config.registrationClosesAt)) {
      return res.status(403).json({ ok: false, message: 'Đã hết hạn đăng ký mùa này.' });
    }

    const { data, errors } = validateLead(req.body);
    if (errors) return res.status(422).json({ ok: false, message: 'Vui lòng kiểm tra lại các trường được đánh dấu.', errors });

    const lead = {
      ...data,
      code: newCode(),
      seasonId: config.seasonId,
      createdAt: nowDate.toISOString(),
    };
    const ipHash = crypto.createHash('sha256').update(config.ipHashSalt + ip).digest('hex').slice(0, 32);

    try {
      const info = db
        .prepare(
          `INSERT INTO leads (code, season_id, full_name, email, phone, segment, segment_other, organization, strength,
             project, motivation, mode, hours_per_week, terms_version, privacy_version, consented_at, source, ip_hash,
             user_agent, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          lead.code, lead.seasonId, lead.fullName, lead.email, lead.phone || null, lead.segment, lead.segmentOther || null, lead.organization,
          lead.strength, lead.project || null, lead.motivation, lead.mode, lead.hoursPerWeek, config.termsVersion,
          config.privacyVersion, lead.createdAt, lead.source || null, ipHash,
          String(req.get('user-agent') || '').slice(0, 300), lead.createdAt
        );
      lead.id = Number(info.lastInsertRowid);
    } catch (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({
          ok: false,
          message: 'Email này đã đăng ký mùa tuyển chọn 2026. Mỗi ứng viên chỉ có một hồ sơ trong một mùa.',
          errors: { email: 'Email đã được dùng để đăng ký mùa này.' },
        });
      }
      console.error('[leads] insert failed', err);
      return res.status(500).json({ ok: false, message: 'Không lưu được hồ sơ. Vui lòng thử lại.' });
    }

    audit(db, { actor: 'public', action: 'lead.create', objectType: 'lead', objectId: lead.code });
    res.status(201).json({ ok: true, code: lead.code, createdAt: lead.createdAt });

    // Gửi Telegram sau khi đã trả phản hồi; kết quả lưu lại để gửi lại nếu lỗi
    const job = notifyAndRecord(lead).finally(() => app.locals.pending.delete(job));
    app.locals.pending.add(job);
  });

  async function notifyAndRecord(lead) {
    const result = await notifier.notifyLead(lead);
    const status = result.ok ? 'sent' : result.error === 'not_configured' ? 'skipped' : 'failed';
    db.prepare('UPDATE leads SET telegram_status = ?, telegram_error = ? WHERE id = ?').run(
      status,
      result.ok ? null : String(result.error).slice(0, 300),
      lead.id
    );
    if (status === 'failed') console.warn(`[telegram] gửi lead ${lead.code} lỗi: ${result.error}`);
    return status;
  }

  // ---- Quản trị (Bearer ADMIN_TOKEN) ----
  const requireAdmin = (req, res, next) => {
    const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!config.adminToken || !token || !safeEqual(token, config.adminToken)) {
      return res.status(401).json({ ok: false, message: 'Không đủ quyền.' });
    }
    next();
  };

  app.get('/api/admin/leads', requireAdmin, (req, res) => {
    const rows = db.prepare('SELECT * FROM leads WHERE season_id = ? ORDER BY id DESC').all(config.seasonId);
    res.json({ ok: true, total: rows.length, leads: rows.map(rowToLead) });
  });

  app.post('/api/admin/leads/:code/retry-telegram', requireAdmin, async (req, res) => {
    const row = db.prepare('SELECT * FROM leads WHERE code = ?').get(req.params.code);
    if (!row) return res.status(404).json({ ok: false, message: 'Không tìm thấy lead.' });
    const status = await notifyAndRecord(rowToLead(row));
    audit(db, { actor: 'admin', action: 'lead.retry_telegram', objectType: 'lead', objectId: row.code, detail: { status } });
    res.json({ ok: status === 'sent', status });
  });

  app.use('/api', (req, res) => res.status(404).json({ ok: false, message: 'Không tìm thấy.' }));

  // Phục vụ bản build frontend khi chạy production local
  if (fs.existsSync(config.frontendDist)) {
    // Asset có hash cache lâu; index.html luôn kiểm tra lại để nhận bản build mới
    app.use(
      express.static(config.frontendDist, {
        index: 'index.html',
        setHeaders: (res, file) => {
          const hashed = file.includes(`${path.sep}assets${path.sep}`);
          res.setHeader('Cache-Control', file.endsWith('.html') ? 'no-cache' : hashed ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
        },
      })
    );
    app.get(/^(?!\/api).*/, (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(config.frontendDist, 'index.html'));
    });
  }

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ ok: false, message: 'Dữ liệu gửi lên không hợp lệ.' });
    if (err.type === 'entity.too.large') return res.status(413).json({ ok: false, message: 'Dữ liệu quá lớn.' });
    console.error(err);
    res.status(500).json({ ok: false, message: 'Lỗi máy chủ. Vui lòng thử lại.' });
  });

  return app;
}
