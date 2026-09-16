const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

const isLocalDev = (url) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2|192\.168\.\d+\.\d+)(:\d+)?(\/|$)/i.test(url)

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL belum dikonfigurasi')
  }
  if (!API_BASE_URL.startsWith('https://') && !isLocalDev(API_BASE_URL)) {
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
    throw new Error(data?.message || 'Permintaan ke server gagal')
  }

  return data
}

export const adminApi = {
  login: (email, password) =>
    apiRequest('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  users: () => apiRequest('/admin/users'),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
  stores: () => apiRequest('/admin/stores'),
  products: () => apiRequest('/foods'),
  orders: () => apiRequest('/admin/orders'),
  logs: () => apiRequest('/admin/logs'),
  communityPosts: (status = 'open') => apiRequest(`/community/posts?status=${status}`),
}

export const authApi = {
  registerUser: (payload) => apiRequest('/register', { method: 'POST', body: JSON.stringify(payload) }),
  registerStore: (payload) => apiRequest('/register/store', { method: 'POST', body: JSON.stringify(payload) }),
  loginUser: (email, password) => apiRequest('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  loginStore: (email, password) => apiRequest('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
}