# Gunyaluck Dev Notes — Backend

REST API server for the [Gunyaluck Dev Notes](https://pjsdf.online) platform.  
Works together with the frontend repository `gunyaluck-dev-notes`.

📦 **Frontend Repo:** [gunyaluck-dev-notes](#)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ES Modules — `"type": "module"`, ไฟล์ `.mjs`) |
| Framework | Express 5 |
| Database | PostgreSQL (via `pg` connection pool) |
| File Upload | Multer |
| Auth / Storage | Supabase (`@supabase/supabase-js`) |
| CORS | cors |
| Env | dotenv |
| Dev | nodemon |

---

## Architecture

Layered architecture — each layer has a single responsibility.

```
routes → controllers → services → repositories → database
```

| Layer | Responsibility |
|-------|---------------|
| routes | รับ HTTP request, กำหนด endpoint |
| controllers | รับ request, ส่งต่อไป service, return response |
| services | business logic |
| repositories | query database |

Database connection จัดการผ่าน `utils/db.mjs` แบบ connection pool ด้วย `pg`

---

## API Endpoints

### Server

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | ส่งข้อความ `Hello TechUp!` |
| `GET` | `/health` | ตรวจ DB — query `SELECT * FROM posts` ถ้าไม่มีแถว return 404 |

### Auth `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | — | สมัครสมาชิก |
| `POST` | `/auth/login` | — | เข้าสู่ระบบ |
| `PUT` | `/auth/reset-password` | — | รีเซ็ตรหัสผ่าน |
| `GET` | `/auth/get-user` | user | ดึงข้อมูล user ปัจจุบัน |
| `GET` | `/auth/landing-author` | — | ดึงข้อมูล author สำหรับ landing page |
| `GET` | `/auth/profile-picture` | user | ดึงรูปโปรไฟล์ |
| `PATCH` | `/auth/profile-picture` | user | อัปเดตรูปโปรไฟล์ |
| `PATCH` | `/auth/profile` | user | อัปเดตข้อมูลโปรไฟล์ |
| `GET` | `/auth/protected-route` | user | ทดสอบ middleware |
| `GET` | `/auth/admin-only` | admin | ทดสอบ admin middleware |

### Posts `/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/posts/published` | — | ดึงบทความที่ publish แล้ว (landing page) |
| `GET` | `/posts/admin` | admin | ดึงบทความทั้งหมด (admin) |
| `GET` | `/posts/admin/:id` | admin | ดึงบทความเดี่ยว (admin) |
| `GET` | `/posts/:id` | — | ดึงบทความเดี่ยว (public) |
| `POST` | `/posts` | admin | สร้างบทความใหม่ + upload รูป (`imageFile`) |
| `PUT` | `/posts/:id` | admin | แก้ไขบทความ |
| `DELETE` | `/posts/:id` | admin | ลบบทความ |
| `GET` | `/posts/:id/comments` | — | ดึง comments ของบทความ |
| `POST` | `/posts/:id/comments` | user | เพิ่ม comment |
| `GET` | `/posts/:id/comments/:commentId/replies` | — | ดึง replies ของ comment |
| `GET` | `/posts/:id/likes` | — | ดึง likes ของบทความ |
| `POST` | `/posts/:id/likes` | user | กดไลค์ |
| `DELETE` | `/posts/:id/likes` | user | ยกเลิกไลค์ |

### Categories `/categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/categories` | — | ดึงหมวดหมู่ทั้งหมด |
| `POST` | `/categories` | admin | สร้างหมวดหมู่ |
| `PUT` | `/categories/:id` | admin | แก้ไขหมวดหมู่ |
| `DELETE` | `/categories/:id` | admin | ลบหมวดหมู่ |

### Notifications `/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/notifications` | user | ดึงการแจ้งเตือน |
| `PATCH` | `/notifications/mark-as-read/:id` | user | mark as read |

### Statuses `/statuses`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/statuses` | — | ดึง post status ทั้งหมด |

---

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL หรือ Supabase project

### Install

```bash
git clone https://github.com/<your-username>/gunyaluck-dev-notes-backend
cd gunyaluck-dev-notes-backend
npm install
```

### Environment variables

สร้างไฟล์ `.env` ที่ root ของโปรเจ็กต์

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
PORT=3000
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `PORT` | Express server port (default: 3000) |

### Run

```bash
# development (auto-reload)
npm run dev

# production
node app.mjs
# Running at http://localhost:3000
```

Health checks: `GET /` และ `GET /health`

---

## Running with Frontend

ดู setup ทั้งหมดได้ที่ [frontend README](https://github.com/<your-username>/gunyaluck-dev-notes)

สรุปสั้น ๆ:

1. Start backend ก่อน (`node app.mjs` — port 3000)
2. Start frontend (`npm run dev` — port 5173)
3. ตั้ง `VITE_API_BASE_URL=http://localhost:3000` ใน frontend `.env`

---

## Deployment

รองรับ 2 แบบ:

**VPS (Ubuntu + PM2 + Nginx)** — production ปัจจุบัน

```
Internet → Nginx (reverse proxy + TLS)
              └── PM2 → node app.mjs (port 3000)
```

- Nginx config อยู่ที่ `deploy/nginx-pjsdf.online.conf`
- PM2 config อยู่ที่ `ecosystem.config.cjs`
- CI/CD ผ่าน GitHub Actions — push to `main` → rsync + SSH → PM2 restart

**Vercel (serverless)** — รองรับผ่าน `vercel.json` ใช้ `@vercel/node` ชี้ที่ `app.mjs`

---

*Part of the Gunyaluck Dev Notes project · Built by Gunyaluck*
