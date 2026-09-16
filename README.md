# FoodRescue Admin Web

React (Vite) dashboard untuk workspace admin FoodRescue, terintegrasi dengan
backend FoodRescue API.

## Run

```powershell
cd foodrescue-admin
npm install
npm run dev
```

Lalu buka `http://localhost:5173/admin` (atau `/admin` setelah build).

## Backend connection

Base URL diatur lewat `VITE_API_BASE_URL` (lihat `.env`). Kini menunjuk ke API
produksi: `http://139.190.96.203:8091/api/v1`. `src/api.js` mengirim bearer token
admin dari `sessionStorage` dan memaksa HTTPS atau localhost.

### Endpoint yang dipakai (cocok dengan `internal/routes/routes.go`)

| Modul | Endpoint |
| --- | --- |
| Login | `POST /auth/login` → `{ token, user }` |
| Dashboard | `GET /admin/dashboard` → `{ analytics }` |
| Pengguna | `GET /admin/users`, `DELETE /admin/users/:id`, `PUT /admin/users/:id/deactivate` |
| Verifikasi | `GET /admin/verifications`, `POST /admin/verifications/:id` |
| Laporan | `GET /admin/reports`, `PUT /admin/reports/:id` |
| Toko aktif (publik) | `GET /tokos` → `{ tokos }` |
| Produk (publik) | `GET /listings` → `{ data }` |

Catatan bentuk respons penting: users memakai `{ users: [...] }` dengan field
`full_name` & `account_status`; login memakai `user.full_name`. Halaman
"Kelola Pesanan", "Analytics", dan "Audit & Aktivitas" diisi dari
`/admin/dashboard` dan antrean moderasi karena backend belum menyediakan
`/admin/orders` dan `/admin/logs`.

Login admin produksi diset lewat database; jangan pernah menaruh password di
variabel lingkungan Vite atau di repo.