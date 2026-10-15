import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { createApp } from '../server/src/app.js';
import { openDb } from '../server/src/db.js';
import { createTelegramNotifier, formatLeadMessage } from '../server/src/telegram.js';

const baseConfig = {
  seasonId: 'ftc-2026',
  registrationClosesAt: '2026-11-30T16:59:59Z',
  termsVersion: 't1',
  privacyVersion: 'p1',
  adminToken: 'secret-admin-token',
  ipHashSalt: 'test',
  frontendDist: '/khong-ton-tai',
};

const validLead = (over = {}) => ({
  fullName: 'Nguyễn Văn An',
  email: 'an@example.com',
  phone: '0901 234 567',
  segment: 'student',
  organization: 'Đại học Hoa Sen',
  strength: 'technology',
  project: '',
  motivation: 'Mình muốn xây sản phẩm AI thật và học từ Founder.',
  mode: 'hybrid',
  hoursPerWeek: 8,
  acceptTerms: true,
  acceptPrivacy: true,
  ...over,
});

let server, base, db, sent, clock, app;

function start(notifyImpl) {
  db = openDb(':memory:');
  sent = [];
  clock = new Date('2026-10-14T03:00:00Z');
  const notifier = { enabled: true, notifyLead: async (lead) => (sent.push(lead), notifyImpl ? notifyImpl(lead) : { ok: true }) };
  app = createApp({ db, notifier, config: baseConfig, now: () => clock });
  return new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
}
const stop = () => new Promise((r) => server.close(() => (db.close(), r())));
const post = (body) =>
  fetch(`${base}/api/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const flush = () => Promise.all([...app.locals.pending]);

describe('POST /api/leads', () => {
  beforeEach(() => start());
  after(() => {});

  test('lưu lead hợp lệ, trả mã xác nhận và gửi Telegram', async () => {
    const res = await post(validLead());
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.match(body.code, /^FTC26-[0-9A-F]{8}$/);
    await flush();
    assert.equal(sent.length, 1);
    assert.equal(sent[0].email, 'an@example.com');
    const row = db.prepare('SELECT * FROM leads').get();
    assert.equal(row.telegram_status, 'sent');
    assert.equal(row.terms_version, 't1');
    assert.equal(row.ip_hash.length, 32);
    await stop();
  });

  test('email trùng trong cùng mùa bị chặn (không phân biệt hoa thường), không gửi Telegram lần 2', async () => {
    await post(validLead());
    const res = await post(validLead({ email: 'AN@Example.com' }));
    assert.equal(res.status, 409);
    await flush();
    assert.equal(sent.length, 1);
    assert.equal(db.prepare('SELECT COUNT(*) c FROM leads').get().c, 1);
    await stop();
  });

  test('thiếu đồng ý thể lệ hoặc thiếu trường → 422 với lỗi cụ thể', async () => {
    const res = await post(validLead({ acceptTerms: false, segment: '', hoursPerWeek: 0 }));
    assert.equal(res.status, 422);
    const body = await res.json();
    assert.ok(body.errors.acceptTerms);
    assert.ok(body.errors.segment);
    assert.ok(body.errors.hoursPerWeek);
    assert.equal(db.prepare('SELECT COUNT(*) c FROM leads').get().c, 0);
    await stop();
  });

  test('nhóm "Khác" bắt buộc ghi rõ và được lưu vào segment_other', async () => {
    const bad = await post(validLead({ segment: 'other', segmentOther: '' }));
    assert.equal(bad.status, 422);
    assert.ok((await bad.json()).errors.segmentOther);
    const ok = await post(validLead({ segment: 'other', segmentOther: 'Freelancer' }));
    assert.equal(ok.status, 201);
    await flush();
    assert.equal(db.prepare('SELECT segment_other FROM leads').get().segment_other, 'Freelancer');
    assert.equal(sent[0].segmentOther, 'Freelancer');
    await stop();
  });

  test('mốc đóng không bao gồm: đúng giờ đóng bị từ chối, 1 giây trước vẫn nhận', async () => {
    clock = new Date('2026-11-30T16:59:58Z');
    assert.equal((await post(validLead())).status, 201);
    clock = new Date('2026-11-30T16:59:59Z');
    assert.equal((await post(validLead({ email: 'b@example.com' }))).status, 403);
    await stop();
  });

  test('Telegram lỗi vẫn lưu lead và ghi trạng thái failed', async () => {
    await stop();
    await start(async () => ({ ok: false, error: 'chat not found' }));
    assert.equal((await post(validLead())).status, 201);
    await flush();
    const row = db.prepare('SELECT telegram_status, telegram_error FROM leads').get();
    assert.equal(row.telegram_status, 'failed');
    assert.equal(row.telegram_error, 'chat not found');
    await stop();
  });

  test('honeypot: bot điền trường ẩn thì không lưu', async () => {
    const res = await post(validLead({ website: 'http://spam' }));
    assert.equal(res.status, 201);
    assert.equal(db.prepare('SELECT COUNT(*) c FROM leads').get().c, 0);
    await stop();
  });

  test('giới hạn 5 lần gửi / 10 phút / IP', async () => {
    for (let i = 0; i < 5; i++) await post(validLead({ email: `u${i}@example.com` }));
    assert.equal((await post(validLead({ email: 'u9@example.com' }))).status, 429);
    await stop();
  });
});

describe('Quản trị', () => {
  before(() => start());
  after(() => stop());

  test('không có token → 401; có token → xem danh sách', async () => {
    await post(validLead());
    assert.equal((await fetch(`${base}/api/admin/leads`)).status, 401);
    assert.equal((await fetch(`${base}/api/admin/leads`, { headers: { Authorization: 'Bearer sai' } })).status, 401);
    const res = await fetch(`${base}/api/admin/leads`, { headers: { Authorization: 'Bearer secret-admin-token' } });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).total, 1);
  });
});

describe('Telegram', () => {
  test('escape HTML trong nội dung lead', () => {
    const text = formatLeadMessage({ ...validLead({ fullName: '<b>X</b> & Y' }), code: 'C', createdAt: new Date().toISOString() });
    assert.ok(text.includes('&lt;b&gt;X&lt;/b&gt; &amp; Y'));
  });

  test('chưa cấu hình token thì bỏ qua, không gọi mạng', async () => {
    let called = false;
    const n = createTelegramNotifier({ token: '', chatId: '', fetchImpl: () => (called = true) });
    assert.deepEqual(await n.send('x'), { ok: false, error: 'not_configured' });
    assert.equal(called, false);
  });
});
