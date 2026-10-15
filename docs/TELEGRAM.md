# Cấu hình thông báo lead qua Telegram

1. Mở Telegram, chat với **@BotFather** → gửi `/newbot` → đặt tên hiển thị và username (kết thúc bằng `bot`).
2. BotFather trả về **token** dạng `123456789:AA...`. Dán vào `.env`:
   ```
   TELEGRAM_BOT_TOKEN=123456789:AA...
   ```
3. Chọn nơi nhận thông báo:
   - **Cá nhân:** mở chat với bot vừa tạo, bấm *Start* (gửi `/start`).
   - **Nhóm:** thêm bot vào nhóm, gửi một tin bất kỳ trong nhóm (ví dụ `/start@ten_bot`).
4. Chạy `npm run telegram:chat-id` → chép `chat_id` (nhóm có số âm) vào `.env`:
   ```
   TELEGRAM_CHAT_ID=-100xxxxxxxxxx
   ```
5. `npm run telegram:test` để gửi tin thử, rồi khởi động lại server.

Khi server chạy, log sẽ hiện `Telegram: đã cấu hình`. Mỗi lead mới gửi một tin gồm mã hồ sơ, họ tên, email, SĐT, nhóm, thế mạnh, hình thức, số giờ và động lực.

**Bảo mật:** token bot là bí mật — chỉ để trong `.env` (đã nằm trong `.gitignore`) hoặc biến môi trường khi deploy. Nếu lộ, vào @BotFather → `/revoke` để cấp token mới.
