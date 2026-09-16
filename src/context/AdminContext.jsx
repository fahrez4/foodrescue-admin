import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { adminApi } from '../api'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem('foodrescue_admin_token'))
  )
  const [admin, setAdmin] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const [usersRes, productsRes, logsRes] = await Promise.allSettled([
        adminApi.users(),
        adminApi.products(),
        adminApi.logs(),
      ])

      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value?.data || [])
      } else {
        console.warn('Users fetch failed:', usersRes.reason?.message)
      }

      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value?.data || [])
      } else {
        console.warn('Products fetch failed:', productsRes.reason?.message)
      }

      if (logsRes.status === 'fulfilled') {
        setLogs(logsRes.value?.data || [])
      } else {
        console.warn('Logs fetch failed:', logsRes.reason?.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const login = useCallback(async (email, password) => {
    const response = await adminApi.login(email, password)
    const payload = response?.data || response
    const user = payload?.user || payload

    if (!['admin', 'superAdmin'].includes(user?.role)) {
      throw new Error('Akun ini bukan admin')
    }

    if (payload?.token) {
      sessionStorage.setItem('foodrescue_admin_token', payload.token)
    }

    setAdmin(user)
    setIsAuthenticated(true)
    return payload
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('foodrescue_admin_token')
    setIsAuthenticated(false)
    setAdmin(null)
    setUsers([])
    setProducts([])
    setLogs([])
  }, [])

  const deleteUser = useCallback(async (id) => {
    await adminApi.deleteUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const value = {
    isAuthenticated,
    admin,
    login,
    logout,
    refresh: loadAll,
    users,
    products,
    logs,
    loading,
    error,
    deleteUser,
    stats: {
      totalUsers: users.length,
      totalProducts: products.length,
      totalLogs: logs.length,
      activeUsers: users.filter((u) => u.status === 'active').length,
      bannedUsers: users.filter((u) => u.status === 'banned').length,
    },
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}