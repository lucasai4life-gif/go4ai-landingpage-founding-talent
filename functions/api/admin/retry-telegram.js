import { formatLeadMessage, sendTelegram } from '../_common.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!env.ADMIN_TOKEN || !token || token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ ok: false, message: 'Không đủ quyền.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, message: 'Cơ sở dữ liệu chưa kết nối.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
    });
  }

  const botToken = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong Cloudflare.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {}

  let rows = [];
  if (body?.code) {
    const { results } = await env.DB.prepare('SELECT * FROM leads WHERE code = ?').bind(body.code).all();
    rows = results || [];
  } else {
    const { results } = await env.DB.prepare(
      "SELECT * FROM leads WHERE telegram_status IN ('failed', 'pending') ORDER BY id ASC LIMIT 50"
    ).all();
    rows = results || [];
  }

  if (!rows.length) {
    return new Response(
      JSON.stringify({ ok: true, message: 'Không có lead nào cần gửi lại.', count: 0, results: [] }),
      { headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' } }
    );
  }

  const results = [];
  for (const r of rows) {
    const lead = {
      id: r.id,
      code: r.code,
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
      createdAt: r.created_at,
    };
    const text = formatLeadMessage(lead);
    const res = await sendTelegram({ token: botToken, chatId, text });
    const status = res.ok ? 'sent' : 'failed';
    await env.DB.prepare(
      'UPDATE leads SET telegram_status = ?, telegram_error = ? WHERE code = ?'
    )
      .bind(status, res.ok ? null : String(res.error).slice(0, 300), lead.code)
      .run();

    results.push({ code: lead.code, email: lead.email, ok: res.ok, status, error: res.ok ? null : res.error });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      total: rows.length,
      successCount: results.filter((r) => r.ok).length,
      failCount: results.filter((r) => !r.ok).length,
      results,
    }),
    { headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' } }
  );
}
