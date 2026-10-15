# Ghi chú khi deploy lên Cloudflare (chưa thực hiện)

Bản hiện tại chạy localhost theo tài liệu hướng dẫn. Cloudflare **không chạy được** tiến trình Node.js lâu dài và file SQLite cục bộ, nên khi deploy cần đổi phần máy chủ:

| Localhost | Cloudflare tương ứng |
|---|---|
| `frontend/dist` (Vite build) | Cloudflare Pages — deploy nguyên thư mục `dist` |
| Express `server/src/app.js` | Pages Functions (`functions/api/*.js`) hoặc một Worker |
| SQLite `data/go4ai.sqlite` | Cloudflare D1 (cũng là SQLite — dùng lại được câu lệnh `CREATE TABLE` trong `server/src/db.js`) |
| `private-files/` | Cloudflare R2 (nếu sau này cần tệp) |
| `.env` | Biến môi trường / Secrets của Pages (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ADMIN_TOKEN`) |

Phần có thể dùng lại gần như nguyên vẹn: `server/src/validate.js`, `server/src/telegram.js` (dùng `fetch` chuẩn), schema bảng `leads`.
Phần cần viết lại: lớp truy cập DB (`env.DB.prepare(...).bind(...).run()` thay cho `node:sqlite`), rate limit (dùng Cloudflare Rate Limiting/Turnstile thay cho bộ nhớ trong tiến trình), và gửi Telegram nên đặt trong `ctx.waitUntil(...)`.

Frontend gọi `/api/...` theo đường dẫn tương đối nên không phải sửa khi chuyển sang Pages Functions.
