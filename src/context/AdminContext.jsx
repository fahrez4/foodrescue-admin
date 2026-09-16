import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { adminApi } from '../api'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem('foodrescue_admin_token'))
  )
  const [admin, setAdmin] = useState(null)

  const [analytics, setAnalytics] = useState({})
  const [users, setUsers] = useState([])
  const [verifications, setVerifications] = useState([])
  const [reports, setReports] = useState([])
  const [listings, setListings] = useState([])
  const [tokos, setTokos] = useState([])
  const [orders, setOrders] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    const results = await Promise.allSettled([
      adminApi.dashboard(),
      adminApi.users(),
      adminApi.pendingUsers(),
      adminApi.reports(),
      adminApi.listings(),
      adminApi.tokos(),
      adminApi.orders(),
      adminApi.logs(),
    ])

    if (results[0].status === 'fulfilled') setAnalytics(results[0].value?.analytics || {})
    if (results[1].status === 'fulfilled') setUsers(results[1].value?.users || [])
    if (results[2].status === 'fulfilled') setVerifications(results[2].value?.pending_users || [])
    if (results[3].status === 'fulfilled') setReports(results[3].value?.reports || [])
    if (results[4].status === 'fulfilled') setListings(results[4].value?.data || [])
    if (results[5].status === 'fulfilled') setTokos(results[5].value?.tokos || [])
    if (results[6].status === 'fulfilled') setOrders(results[6].value?.orders || results[6].value?.data || [])
    if (results[7].status === 'fulfilled') setLogs(results[7].value?.logs || results[7].value?.data || [])

    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length === results.length) {
      setError(failures[0].reason?.message || 'Gagal memuat data')
    }
    setLoading(false)
  }, [isAuthenticated])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const login = useCallback(async (email, password) => {
    const response = await adminApi.login(email, password)
    const user = response?.user
    if (!['admin', 'superAdmin'].includes(user?.role)) {
      throw new Error('Akun ini bukan admin')
    }
    if (response?.token) {
      sessionStorage.setItem('foodrescue_admin_token', response.token)
    }
    setAdmin({ ...user, name: user?.full_name || user?.name || 'Admin' })
    setIsAuthenticated(true)
    return response
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('foodrescue_admin_token')
    setIsAuthenticated(false)
    setAdmin(null)
    setUsers([])
    setVerifications([])
    setReports([])
    setListings([])
    setTokos([])
    setOrders([])
    setLogs([])
    setAnalytics({})
  }, [])

  const deleteUser = useCallback(async (id) => {
    await adminApi.deleteUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setVerifications((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const deactivateUser = useCallback(async (id) => {
    await adminApi.deactivateUser(id)
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, account_status: 'suspended' } : u))
    )
  }, [])

  const verifyUser = useCallback(async (id, status) => {
    await adminApi.verifyUser(id, status)
    setVerifications((prev) => prev.filter((u) => u.id !== id))
    const newStatus = status === 'approved' ? 'active' : 'rejected'
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, account_status: newStatus } : u))
    )
  }, [])

  const reviewReport = useCallback(async (id, status) => {
    await adminApi.reviewReport(id, status)
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, report_status: status } : r
      )
    )
  }, [])

  const createUser = useCallback(async (payload) => {
    const response = await adminApi.createUser(payload)
    await loadAll()
    return response
  }, [loadAll])

  const updateUser = useCallback(async (id, payload) => {
    const response = await adminApi.updateUser(id, payload)
    await loadAll()
    return response
  }, [loadAll])

  const saveToko = useCallback(async (id, payload) => {
    const response = id ? await adminApi.updateToko(id, payload) : await adminApi.createToko(payload)
    await loadAll()
    return response
  }, [loadAll])

  const deleteToko = useCallback(async (id) => {
    await adminApi.deleteToko(id)
    setTokos((prev) => prev.filter((toko) => toko.id !== id))
  }, [])

  const saveListing = useCallback(async (id, payload) => {
    const response = id ? await adminApi.updateListing(id, payload) : await adminApi.createListing(payload)
    await loadAll()
    return response
  }, [loadAll])

  const deleteListing = useCallback(async (id) => {
    await adminApi.deleteListing(id)
    setListings((prev) => prev.filter((listing) => listing.id !== id))
  }, [])

  const updateOrder = useCallback(async (id, payload) => {
    const response = await adminApi.updateOrder(id, payload)
    await loadAll()
    return response
  }, [loadAll])

  const deleteOrder = useCallback(async (id) => {
    await adminApi.deleteOrder(id)
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }, [])

  const storeNameById = useCallback(
    (id) => tokos.find((t) => t.id === id)?.business_name || 'Toko',
    [tokos]
  )

  const value = {
    isAuthenticated,
    admin,
    login,
    logout,
    refresh: loadAll,
    loading,
    error,
    analytics,
    users,
    verifications,
    reports,
    listings,
    tokos,
    orders,
    logs,
    deleteUser,
    deactivateUser,
    verifyUser,
    reviewReport,
    createUser,
    updateUser,
    saveToko,
    deleteToko,
    saveListing,
    deleteListing,
    updateOrder,
    deleteOrder,
    storeNameById,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}