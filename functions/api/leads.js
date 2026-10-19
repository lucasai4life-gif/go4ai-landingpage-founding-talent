import { validateLead, newCode, hashIp, formatLeadMessage, sendTelegram } from './_common.js';

const ipHits = new Map();
function isRateLimited(ip, nowMs, windowMs = 10 * 60 * 1000, max = 5) {
  if (ipHits.size > 2000) {
    for (const [k, list] of ipHits.entries()) {
      if (!list.some((t) => nowMs - t < windowMs)) ipHits.delete(k);
    }
  }
  const list = (ipHits.get(ip) || []).filter((t) => nowMs - t < windowMs);
  list.push(nowMs);
  ipHits.set(ip, list);
  return list.length > max;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const now = new Date();
  const registrationClosesAt = env.REGISTRATION_CLOSES_AT || '2026-11-30T16:59:59Z';
  const seasonId = env.SEASON_ID || 'ftc-2026';
  const termsVersion = 'the-le-ftc-2026-v1';
  const privacyVersion = 'xu-ly-du-lieu-ftc-2026-v1';
  const ipHashSalt = env.IP_HASH_SALT || 'go4ai-local';

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, message: 'Dữ liệu gửi lên không hợp lệ.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
    });
  }

  // Honeypot: bot điền trường ẩn → trả thành công giả, không lưu
  if (body?.website) {
    return new Response(
      JSON.stringify({ ok: true, code: newCode(), createdAt: now.toISOString() }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  if (isRateLimited(clientIp, now.getTime())) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Bạn gửi quá nhiều lần. Vui lòng thử lại sau ít phút.' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  // Mốc đóng không bao gồm (now < closesAt)
  if (now >= new Date(registrationClosesAt)) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Đã hết hạn đăng ký mùa này.' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  const { data, errors } = validateLead(body);
  if (errors) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Vui lòng kiểm tra lại các trường được đánh dấu.', errors }),
      {
        status: 422,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  const lead = {
    ...data,
    code: newCode(),
    seasonId,
    createdAt: now.toISOString(),
  };

  const ipHash = await hashIp(clientIp, ipHashSalt);
  const userAgent = String(request.headers.get('user-agent') || '').slice(0, 300);

  if (!env.DB) {
    console.error('[leads] Cơ sở dữ liệu (D1) chưa được kết nối.');
    return new Response(
      JSON.stringify({ ok: false, message: 'Cơ sở dữ liệu chưa sẵn sàng. Vui lòng thử lại sau.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  try {
    await env.DB.prepare(
      `INSERT INTO leads (code, season_id, full_name, email, phone, segment, segment_other, organization, strength,
         project, motivation, mode, hours_per_week, terms_version, privacy_version, consented_at, source, ip_hash,
         user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        lead.code,
        lead.seasonId,
        lead.fullName,
        lead.email,
        lead.phone || null,
        lead.segment,
        lead.segmentOther || null,
        lead.organization,
        lead.strength,
        lead.project || null,
        lead.motivation,
        lead.mode,
        lead.hoursPerWeek,
        termsVersion,
        privacyVersion,
        lead.createdAt,
        lead.source || null,
        ipHash,
        userAgent,
        lead.createdAt
      )
      .run();

    // Audit log
    await env.DB.prepare(
      `INSERT INTO audit_log (actor, action, object_type, object_id, detail, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind('public', 'lead.create', 'lead', lead.code, null, now.toISOString())
      .run();
  } catch (err) {
    const msg = String(err?.message || err);
    if (msg.includes('UNIQUE')) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Email này đã đăng ký mùa tuyển chọn 2026. Mỗi ứng viên chỉ có một hồ sơ trong một mùa.',
          errors: { email: 'Email đã được dùng để đăng ký mùa này.' },
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
        }
      );
    }
    console.error('[leads] insert failed', err);
    return new Response(
      JSON.stringify({ ok: false, message: 'Không lưu được hồ sơ. Vui lòng thử lại.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  // Tự động gửi Telegram qua Bot API
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    context.waitUntil(
      (async () => {
        const text = formatLeadMessage(lead);
        const res = await sendTelegram({ token, chatId, text });
        const status = res.ok ? 'sent' : 'failed';
        try {
          await env.DB.prepare(
            'UPDATE leads SET telegram_status = ?, telegram_error = ? WHERE code = ?'
          )
            .bind(status, res.ok ? null : String(res.error).slice(0, 300), lead.code)
            .run();
        } catch (e) {
          console.error('[leads] Update telegram status error', e);
        }
      })()
    );
  } else {
    // Lưu trạng thái pending và ghi chú để hỗ trợ gửi lại an toàn khi cấu hình secrets
    try {
      await env.DB.prepare(
        'UPDATE leads SET telegram_status = ?, telegram_error = ? WHERE code = ?'
      )
        .bind('pending', 'Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID', lead.code)
        .run();
    } catch (e) {
      console.error('[leads] Update telegram status error', e);
    }
  }

  return new Response(
    JSON.stringify({ ok: true, code: lead.code, createdAt: lead.createdAt }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
