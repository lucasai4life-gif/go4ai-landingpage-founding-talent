export const SEGMENTS = ['student', 'employee', 'founder', 'other'];
export const STRENGTHS = ['business', 'technology', 'ecosystem', 'operations'];
export const MODES = ['online', 'offline', 'hybrid'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 .-]{8,16}$/;

const clean = (v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
const cleanMultiline = (v) => (typeof v === 'string' ? v.trim().replace(/\r\n/g, '\n') : '');

/**
 * Kiểm tra dữ liệu đăng ký tại server. Trả về { data } hoặc { errors } theo từng trường
 * để UI hiển thị lỗi cụ thể mà không làm mất nội dung đang nhập.
 */
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
