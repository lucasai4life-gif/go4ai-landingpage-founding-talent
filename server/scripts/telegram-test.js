import './_env.js';
import { createTelegramNotifier } from '../src/telegram.js';

const notifier = createTelegramNotifier({
  token: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
});
const result = await notifier.notifyLead({
  code: 'FTC26-TEST0000',
  createdAt: new Date().toISOString(),
  fullName: 'Ứng viên thử nghiệm',
  email: 'test@example.com',
  phone: '0900000000',
  segment: 'student',
  organization: 'Dữ liệu thực hành',
  strength: 'technology',
  mode: 'hybrid',
  hoursPerWeek: 8,
  motivation: 'Tin nhắn kiểm tra cấu hình thông báo lead từ máy local.',
  source: 'telegram:test',
});
console.log(result.ok ? 'Đã gửi tin nhắn thử thành công.' : `Gửi lỗi: ${result.error}`);
process.exit(result.ok ? 0 : 1);
