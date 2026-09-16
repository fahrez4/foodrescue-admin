const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

const isLocalDev = (url) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2|192\.168\.\d+\.\d+)(:\d+)?(\/|$)/i.test(url)

// Host http:// yang diizinkan (tanpa HTTPS) — default: API produksi.
// Bisa ditimpa via VITE_ALLOW_HTTP_HOSTS di .env (pisahkan dengan koma).
const extraHttpHosts = (import.meta.env.VITE_ALLOW_HTTP_HOSTS || '139.190.96.203')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean)

const isAllowedHttpHost = (url) =>
  extraHttpHosts.some((host) => {
    try {
      return new RegExp(`^https?://${host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(:\\d+)?(/|$)`).test(url)
    } catch {
      return false
    }
  })

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL belum dikonfigurasi')
  }
  if (!API_BASE_URL.startsWith('https://') && !isLocalDev(API_BASE_URL) && !isAllowedHttpHost(API_BASE_URL)) {
    throw new Error('API wajib HTTPS atau localhost')
  }

  const token = sessionStorage.getItem('foodrescue_admin_token')
  const url = `${API_BASE_URL}/${path.replace(/^\//, '')}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (response.status === 401) {
    sessionStorage.removeItem('foodrescue_admin_token')
    throw new Error('Sesi berakhir, silakan login ulang')
  }
  if (response.status === 403) {
    throw new Error('Akses ditolak — Anda bukan admin')
  }

  let data = null
  try {
    data = response.status === 204 ? null : await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Permintaan ke server gagal')
  }

  return data
}

// Aplikasi mobile (dipakai saat pengguna/admin mengakses modul lain).
export const authApi = {
  registerUser: (payload) => apiRequest('/register', { method: 'POST', body: JSON.stringify(payload) }),
  registerStore: (payload) => apiRequest('/register/store', { method: 'POST', body: JSON.stringify(payload) }),
  loginUser: (email, password) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  loginStore: (email, password) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
}

// Admin panel — endpoint di: internal/routes/routes.go (grup /admin).
export const adminApi = {
  login: (email, password) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  dashboard: () => apiRequest('/admin/dashboard'),

  // Pengguna
  users: (role) => apiRequest(`/admin/users${role ? `?role=${encodeURIComponent(role)}` : ''}`),
  createUser: (payload) => apiRequest('/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) => apiRequest(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
  deactivateUser: (id) => apiRequest(`/admin/users/${id}/deactivate`, { method: 'PUT' }),
  pendingUsers: () => apiRequest('/admin/verifications'),
  verifyUser: (id, status) =>
    apiRequest(`/admin/verifications/${id}`, { method: 'POST', body: JSON.stringify({ status }) }),
  verifyNgo: (id, isVerified) =>
    apiRequest(`/admin/users/${id}/verify-ngo`, {
      method: 'PUT',
      body: JSON.stringify({ is_verified: isVerified }),
    }),

  // Laporan
  reports: () => apiRequest('/admin/reports'),
  reviewReport: (id, status) =>
    apiRequest(`/admin/reports/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Data publik (toko aktif & listing aktif)
  tokos: () => apiRequest('/tokos'),
  adminTokos: () => apiRequest('/admin/tokos'),
  createToko: (payload) => apiRequest('/admin/tokos', { method: 'POST', body: JSON.stringify(payload) }),
  updateToko: (id, payload) => apiRequest(`/admin/tokos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteToko: (id) => apiRequest(`/admin/tokos/${id}`, { method: 'DELETE' }),
  listings: () => apiRequest('/listings'),
  adminListings: () => apiRequest('/admin/listings'),
  createListing: (payload) => apiRequest('/admin/listings', { method: 'POST', body: JSON.stringify(payload) }),
  updateListing: (id, payload) => apiRequest(`/admin/listings/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteListing: (id) => apiRequest(`/admin/listings/${id}`, { method: 'DELETE' }),

  // Operasional pesanan dan audit.
  orders: () => apiRequest('/admin/orders'),
  updateOrder: (id, payload) => apiRequest(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteOrder: (id) => apiRequest(`/admin/orders/${id}`, { method: 'DELETE' }),
  logs: () => apiRequest('/admin/logs'),
}