import './_env.js';

// Nhắn bất kỳ tin nào cho bot (hoặc thêm bot vào nhóm và nhắn trong nhóm), rồi chạy script này.
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Thiếu TELEGRAM_BOT_TOKEN trong .env');
  process.exit(1);
}
const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const body = await res.json();
if (!body.ok) {
  console.error('Telegram trả lỗi:', body.description);
  process.exit(1);
}
const chats = new Map();
for (const u of body.result) {
  const chat = (u.message || u.channel_post || u.my_chat_member || {}).chat;
  if (chat) chats.set(chat.id, chat);
}
if (!chats.size) {
  console.log('Chưa thấy tin nhắn nào. Hãy nhắn /start cho bot rồi chạy lại.');
} else {
  for (const c of chats.values()) {
    console.log(`chat_id=${c.id}  type=${c.type}  ${c.title || [c.first_name, c.last_name].filter(Boolean).join(' ') || c.username || ''}`);
  }
}
