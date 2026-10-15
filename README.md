# GO4AI Founding Talent Challenge 2026 — Landing page & thu lead

Landing page giới thiệu + form đăng ký (tương ứng UI02 trong tài liệu `02_QUY_TRINH_TRIEN_KHAI_LOCALHOST_FOUNDING_TALENT_V1`).
Lead được lưu vào SQLite tại máy và gửi thông báo qua Telegram.

| Phần | Công nghệ |
|---|---|
| Frontend | React 19 + Vite 8, `motion` (animation) |
| Máy chủ | Node.js (≥ 22.13) + Express 5, chỉ lắng nghe `127.0.0.1` |
| Database | SQLite qua `node:sqlite` có sẵn trong Node (không cần build native) |
| Tệp | `private-files/` (ngoài thư mục public, chỉ server truy cập) |

```
founding-talent-landing/
├── frontend/        React + Vite (src/sections/* = từng section của landing)
├── server/          API Node.js (src/app.js) + scripts tiện ích
├── data/            go4ai.sqlite (tự tạo khi chạy)
├── private-files/   tệp riêng tư (chưa dùng ở landing)
├── tests/           kiểm thử API (node --test)
└── docs/            hướng dẫn Telegram, deploy
```

## Cài đặt & chạy

```bash
npm run install:all          # cài root + server + frontend
cp .env.example .env         # rồi điền TELEGRAM_*, ADMIN_TOKEN
npm run dev                  # API :8787 + Vite :5173 (mở http://127.0.0.1:5173)
```

Chạy bản build như production local:

```bash
npm run build && npm start   # mở http://127.0.0.1:8787
```

Dừng: `Ctrl + C`.

## Lệnh tiện ích

| Lệnh | Việc làm |
|---|---|
| `npm test` | Chạy kiểm thử API (lưu lead, trùng email, thiếu đồng ý, mốc đóng, Telegram lỗi, honeypot, rate limit, quyền admin) |
| `npm run telegram:chat-id` | Lấy `chat_id` sau khi nhắn `/start` cho bot |
| `npm run telegram:test` | Gửi tin nhắn thử với cấu hình trong `.env` |
| `npm run leads:export` | Xuất CSV (UTF-8, mở được bằng Excel) vào `data/exports/` |
| `npm run backup` | Sao lưu đồng bộ database + `private-files/` vào `backups/<thời điểm>/` |

## API

| Method | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/api/season` | Hạn đăng ký, giờ máy chủ, trạng thái mở |
| POST | `/api/leads` | Gửi hồ sơ. 201 = thành công (kèm mã `FTC26-XXXXXXXX`), 409 = email đã đăng ký mùa này, 422 = lỗi trường, 403 = hết hạn, 429 = gửi quá nhiều |
| GET | `/api/admin/leads` | Danh sách lead — header `Authorization: Bearer <ADMIN_TOKEN>` |
| POST | `/api/admin/leads/:code/retry-telegram` | Gửi lại thông báo Telegram cho lead bị lỗi |

## Quy tắc đã áp dụng từ tài liệu hướng dẫn

- Một hồ sơ / email / mùa (khóa duy nhất `email + season_id`); email không phân biệt hoa thường.
- Hạn đăng ký do **máy chủ** quyết định, mốc đóng không bao gồm (`now < closesAt`); lưu UTC, hiển thị Asia/Ho_Chi_Minh.
- Lưu phiên bản thể lệ / chính sách và thời điểm đồng ý.
- Lỗi không làm mất nội dung: form tự lưu nháp trên trình duyệt; nút gửi khóa khi đang gửi; có mã + thời điểm xác nhận.
- Telegram gửi **sau khi** đã lưu lead; Telegram lỗi không làm mất lead (`telegram_status = failed`, gửi lại được).
- Không lưu IP gốc (chỉ lưu hash có muối); `.env` không đưa vào git.

## Khôi phục dữ liệu

1. Dừng server.
2. Chép `backups/<thời điểm>/go4ai.sqlite` đè lên `data/go4ai.sqlite` (xóa `go4ai.sqlite-wal`, `-shm` nếu có) và chép lại `private-files/`.
3. Khởi động lại, mở trang và kiểm tra `GET /api/admin/leads`.

Xem thêm: [docs/TELEGRAM.md](docs/TELEGRAM.md) · [docs/DEPLOY-CLOUDFLARE.md](docs/DEPLOY-CLOUDFLARE.md)
