export const SEGMENTS = ['student', 'employee', 'founder', 'other'];
export const STRENGTHS = ['business', 'technology', 'ecosystem', 'operations'];
export const MODES = ['online', 'offline', 'hybrid'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 .-]{8,16}$/;

const clean = (v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
const cleanMultiline = (v) => (typeof v === 'string' ? v.trim().replace(/\r\n/g, '\n') : '');

export function validateLead(input = {}) {
  const errors = {};
  const data = {
    fullName: clean(input.fullName),
    email: clean(input.email).toLowerCase(),
    phone: clean(input.phone),
    segment: clean(input.segment),
    segmentOther: clean(input.segmentOther),
    organization: clean(input.organization),
    strength: clean(input.strength),
    project: cleanMultiline(input.project),
    motivation: cleanMultiline(input.motivation),
    mode: clean(input.mode),
    hoursPerWeek: Number(input.hoursPerWeek),
    acceptTerms: input.acceptTerms === true,
    acceptPrivacy: input.acceptPrivacy === true,
    source: clean(input.source).slice(0, 200),
  };

  if (data.fullName.length < 2 || data.fullName.length > 100) errors.fullName = 'Vui lòng nhập họ và tên (2–100 ký tự).';
  if (!EMAIL_RE.test(data.email) || data.email.length > 254) errors.email = 'Email chưa đúng định dạng.';
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = 'Số điện thoại chưa đúng định dạng.';
  if (!SEGMENTS.includes(data.segment)) errors.segment = 'Vui lòng chọn nhóm ứng viên.';
  if (data.segment === 'other') {
    if (data.segmentOther.length < 2 || data.segmentOther.length > 100) errors.segmentOther = 'Vui lòng ghi rõ bạn thuộc nhóm nào (2–100 ký tự).';
  } else {
    data.segmentOther = '';
  }
  if (data.organization.length < 2 || data.organization.length > 200) errors.organization = 'Vui lòng nhập trường học / đơn vị.';
  if (!STRENGTHS.includes(data.strength)) errors.strength = 'Vui lòng chọn thế mạnh chuyên môn.';
  if (data.project.length > 1000) errors.project = 'Tối đa 1000 ký tự.';
  if (data.motivation.length < 20) errors.motivation = 'Chia sẻ ít nhất 20 ký tự về động lực tham gia.';
  else if (data.motivation.length > 1000) errors.motivation = 'Tối đa 1000 ký tự.';
  if (!MODES.includes(data.mode)) errors.mode = 'Vui lòng chọn hình thức tham gia.';
  if (!Number.isInteger(data.hoursPerWeek) || data.hoursPerWeek < 1 || data.hoursPerWeek > 80) {
    errors.hoursPerWeek = 'Nhập số giờ nguyên từ 1 đến 80.';
  }
  if (!data.acceptTerms) errors.acceptTerms = 'Bạn cần đồng ý với Thể lệ chương trình.';
  if (!data.acceptPrivacy) errors.acceptPrivacy = 'Bạn cần đồng ý với Chính sách xử lý dữ liệu cá nhân.';

  return Object.keys(errors).length ? { errors } : { data };
}

export function newCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return `FTC26-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

export async function hashIp(ip, salt = 'go4ai-local') {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

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

export async function sendTelegram({ token, chatId, text }) {
  if (!token || !chatId) return { ok: false, error: 'not_configured' };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
