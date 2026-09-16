import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import AdminLogin from './AdminLogin'
import AdminSidebar from '../components/AdminSidebar'
import AdminTopbar from '../components/AdminTopbar'
import DashboardPage from './DashboardPage'
import UsersPage from './UsersPage'
import StoresPage from './StoresPage'
import ProductsPage from './ProductsPage'
import OrdersPage from './OrdersPage'
import AnalyticsPage from './AnalyticsPage'
import ReportsPage from './ReportsPage'
import LogsPage from './LogsPage'
import SettingsPage from './SettingsPage'

const pages = [
  DashboardPage, UsersPage, StoresPage, ProductsPage,
  OrdersPage, AnalyticsPage, ReportsPage, LogsPage, SettingsPage,
]

const titles = [
  'Dashboard', 'Kelola Pengguna', 'Kelola Toko', 'Kelola Produk',
  'Kelola Pesanan', 'Analytics', 'Laporan & Export', 'Audit Logs', 'Pengaturan',
]

export default function AdminLayout() {
  const { isAuthenticated } = useAdmin()
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    document.title = 'FoodRescue Admin'
  }, [])

  if (!isAuthenticated) return <AdminLogin />

  const CurrentPage = pages[selectedIndex]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9' }}>
      <AdminSidebar selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTopbar title={titles[selectedIndex]} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <CurrentPage />
        </main>
      </div>
    </div>
  )
}