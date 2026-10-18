export async function onRequestGet(context) {
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

  const seasonId = env.SEASON_ID || 'ftc-2026';
  const { results } = await env.DB.prepare(
    'SELECT * FROM leads WHERE season_id = ? ORDER BY id DESC'
  )
    .bind(seasonId)
    .all();

  const leads = (results || []).map((r) => ({
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
  }));

  return new Response(JSON.stringify({ ok: true, total: leads.length, leads }), {
    headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
  });
}
