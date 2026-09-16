# FoodRescue Admin Web

React JavaScript dashboard for the FoodRescue admin workspace. The current UI uses local demo data so it can be previewed before the backend is available.

## Run

```powershell
cd admin-web
npm install
npm run dev
```

## Backend connection

Copy `.env.example` to `.env`, then set `VITE_API_BASE_URL` to the real HTTPS API. The adapter in `src/api.js` sends the admin bearer token through `sessionStorage` and rejects non-HTTPS URLs.

Expected endpoints:

- `POST /admin/login`
- `GET /admin/products`
- `GET /admin/users`
- `GET /admin/orders`

The backend must enforce JWT signature, expiry, role, object permissions, rate limiting, and audit logging. Never put admin passwords or API secrets in Vite environment variables.
