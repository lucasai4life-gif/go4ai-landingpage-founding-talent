# Hướng dẫn & Cấu hình triển khai Cloudflare Pages

Dự án đã được triển khai lên Cloudflare Pages kết hợp Pages Functions và Cloudflare D1.

## Kiến trúc triển khai

| Thành phần | Localhost | Cloudflare Pages |
|---|---|---|
| **Frontend** | React 19 + Vite 8 (`frontend/dist`) | Cloudflare Pages — tự động build từ source (`frontend/dist`) |
| **API Server** | Express 5 (`server/src/app.js`) | Cloudflare Pages Functions (`functions/api/*.js`) |
| **Database** | SQLite qua `node:sqlite` (`data/go4ai.sqlite`) | Cloudflare D1 (`go4ai-founding-talent-leads`) |
| **Môi trường & Secrets** | `.env` | Cloudflare Pages Environment Variables / Secrets (`DB`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ADMIN_TOKEN`) |

## Cấu hình tự động kết nối GitHub

- **Repository**: `https://github.com/lucasai4life-gif/go4ai-landingpage-founding-talent`
- **Branch sản xuất**: `main`
- **Lệnh build**: `npm --prefix frontend install && npm run build --prefix frontend`
- **Thư mục đầu ra**: `frontend/dist`
- **Pages URL**: `https://go4ai-landingpage-founding-talent.pages.dev`

Mỗi khi có commit mới được push lên nhánh `main`, Cloudflare Pages sẽ tự động kích hoạt tiến trình build và deploy.
