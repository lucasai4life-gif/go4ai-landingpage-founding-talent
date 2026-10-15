const LABELS = {
  segment: { student: 'Sinh viên', employee: 'Người đi làm', founder: 'Từng khởi nghiệp', other: 'Khác' },
  strength: { business: 'Business', technology: 'Technology', ecosystem: 'Ecosystem', operations: 'Operations' },
  mode: { online: 'Online', offline: 'Offline', hybrid: 'Hybrid' },
};

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s = '', n = 300) => (s.length > n ? `${s.slice(0, n)}…` : s);

export function formatLeadMessage(lead) {
  const time = new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  return [
    '<b>🟢 Lead mới — Founding Talent 2026</b>',
    `<code>${esc(lead.code)}</code> · ${esc(time)}`,
    '',
    `<b>Họ tên:</b> ${esc(lead.fullName)}`,
    `<b>Email:</b> ${esc(lead.email)}`,
    lead.phone ? `<b>SĐT:</b> ${esc(lead.phone)}` : null,
    `<b>Nhóm:</b> ${esc(lead.segment === 'other' && lead.segmentOther ? `Khác: ${lead.segmentOther}` : LABELS.segment[lead.segment])} · ${esc(lead.organization)}`,
    `<b>Thế mạnh:</b> ${esc(LABELS.strength[lead.strength])}`,
    `<b>Hình thức:</b> ${esc(LABELS.mode[lead.mode])} · ${lead.hoursPerWeek} giờ/tuần`,
    '',
    `<b>Động lực:</b> ${esc(clip(lead.motivation))}`,
    lead.project ? `<b>Dự án:</b> ${esc(clip(lead.project, 200))}` : null,
    lead.source ? `<i>Nguồn: ${esc(lead.source)}</i>` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

/** Gửi tin nhắn qua Telegram Bot API. Không ném lỗi: trả về { ok, error } để lưu trạng thái. */
export function createTelegramNotifier({ token, chatId, fetchImpl = fetch }) {
  const enabled = Boolean(token && chatId);
  async function send(text) {
    if (!enabled) return { ok: false, error: 'not_configured' };
    try {
      const res = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) return { ok: false, error: body.description || `HTTP ${res.status}` };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.name === 'TimeoutError' ? 'timeout' : err.message };
    }
  }
  return { enabled, send, notifyLead: (lead) => send(formatLeadMessage(lead)) };
}
