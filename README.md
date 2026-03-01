# PineToyzz (MongoDB Ready)

This project now includes MongoDB backend foundation for categories/products CRUD and catalog seeding.

## 1) Install required packages

Run in project root:

```bash
npm install
```

If install fails, ensure your machine has internet and Node version is updated.

## 2) Required Node version

Next.js in this project needs:

- `>= 18.18.0` (or Node 20+ recommended)

Check:

```bash
node -v
```

## 3) Configure environment

Copy env template:

```bash
cp .env.example .env.local
```

Then set values in `.env.local`:

- `MONGODB_URI`: Atlas connection string
- `MONGODB_DB`: database name (example: `pinetoyzz`)
- `ADMIN_API_KEY`: strong secret token for admin APIs
- `NEXT_PUBLIC_ADMIN_API_KEY`: same token value, used by admin dashboard UI requests
- `USER_AUTH_SECRET`: secret for user login session JWT cookie

## 4) Start app

```bash
npm run dev
```

## 5) Verify DB connection

Open:

- `GET /api/health/db`

Expected response:

```json
{ "ok": true, "dbName": "pinetoyzz", "host": "..." }
```

## 6) Seed default toy catalog

Use POST request with admin token:

```bash
curl -X POST http://localhost:3000/api/admin/seed/catalog \
  -H "x-admin-token: YOUR_ADMIN_API_KEY"
```

## 7) Admin CRUD APIs

All admin APIs require header:

- `x-admin-token: YOUR_ADMIN_API_KEY`

Endpoints:

- `GET/POST /api/admin/categories`
- `GET/PATCH/DELETE /api/admin/categories/:id`
- `GET/POST /api/admin/products`
- `GET/PATCH/DELETE /api/admin/products/:id`
- `POST /api/admin/upload` (multipart image upload for category/product)
- `POST /api/admin/import/csv` (bulk import categories/products from CSV)

User auth/account APIs:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET/PATCH /api/user/state`
- `POST /api/user/orders`

Upload constraints:
- Image upload: PNG/JPG/WEBP/SVG, max 5MB
- CSV import: `.csv` only, max 2MB
- CSV import returns row-level issues (invalid rows are skipped, valid rows are upserted)

Public endpoints:

- `GET /api/categories`
- `GET /api/products`

## 8) Atlas setup (quick)

1. Create MongoDB Atlas free cluster.
2. Create database user with password.
3. In Network Access, allow your IP (or `0.0.0.0/0` for testing only).
4. Get connection string from Atlas and place in `MONGODB_URI`.
5. Start app and call `/api/health/db`.
# Toyzz
