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
admin dari `sessionStorage`. Koneksi HTTP non-HTTPS hanya diizinkan untuk
localhost/IP pribadi atau host yang terdaftar di `VITE_ALLOW_HTTP_HOSTS`
(default: `139.190.96.203`).

### Endpoint yang dipakai (cocok dengan `internal/routes/routes.go`)

| Modul | Endpoint |
| --- | --- |
| Login | `POST /auth/login` → `{ token, user }` |
| Dashboard | `GET /admin/dashboard` → `{ analytics }` |
| Pengguna | `GET /admin/users`, `DELETE /admin/users/:id`, `PUT /admin/users/:id/deactivate` |
| CRUD Pengguna | `POST /admin/users`, `PUT /admin/users/:id` |
| Verifikasi | `GET /admin/verifications`, `POST /admin/verifications/:id` |
| Laporan | `GET /admin/reports`, `PUT /admin/reports/:id` |
| Toko aktif (publik) | `GET /tokos` → `{ tokos }` |
| Produk (publik) | `GET /listings` → `{ data }` |
| CRUD Toko | `GET /admin/tokos`, `POST /admin/tokos`, `PUT /admin/tokos/:id`, `DELETE /admin/tokos/:id` |
| CRUD Produk | `GET /admin/listings`, `POST /admin/listings`, `PUT /admin/listings/:id`, `DELETE /admin/listings/:id` |
| Operasional | `GET /admin/orders`, `PUT /admin/orders/:id`, `DELETE /admin/orders/:id`, `GET /admin/logs` |

Catatan bentuk respons penting: users memakai `{ users: [...] }` dengan field
`full_name` & `account_status`; login memakai `user.full_name`. Halaman
"Kelola Pesanan", "Analytics", dan "Audit & Aktivitas" diisi dari
`/admin/dashboard` dan antrean moderasi karena backend belum menyediakan
`/admin/orders` dan `/admin/logs`. Tombol CRUD Toko, Produk, Pengguna, serta
operasional Pesanan menggunakan endpoint admin pada tabel di atas dan perlu
diaktifkan di backend agar tidak mengembalikan 404.

Login admin produksi diset lewat database; jangan pernah menaruh password di
variabel lingkungan Vite atau di repo.