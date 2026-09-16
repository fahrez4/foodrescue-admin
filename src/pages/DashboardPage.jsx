import { useEffect, useState } from 'react'
import {
  Users, Store, Bike, Receipt, Wallet, Leaf,
  ShieldCheck, FileWarning, RefreshCw,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import StatCard from '../components/StatCard'

const fmtRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

export default function DashboardPage() {
  const { analytics, users, loading, refresh } = useAdmin()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Selamat pagi')
    else if (hour < 18) setGreeting('Selamat siang')
    else setGreeting('Selamat malam')
  }, [])

  const cards = [
    { title: 'Total Pengguna', value: analytics.total_users ?? 0, icon: Users, color: '#2E7D32', subtitle: 'akun customer' },
    { title: 'Total Toko', value: analytics.total_toko ?? 0, icon: Store, color: '#1976D2', subtitle: 'mitra aktif' },
    { title: 'Total Kurir', value: analytics.total_kurir ?? 0, icon: Bike, color: '#7B1FA2', subtitle: 'ekoregion' },
    { title: 'Total Pesanan', value: analytics.total_orders ?? 0, icon: Receipt, color: '#F57C00', subtitle: `${analytics.completed_orders ?? 0} selesai` },
    { title: 'Pendapatan', value: fmtRp(analytics.total_revenue), icon: Wallet, color: '#00897B', subtitle: 'dari pesanan lunas' },
    { title: 'Makanan Terselamatkan', value: `${(analytics.total_food_saved_kg ?? 0).toFixed(1)} kg`, icon: Leaf, color: '#43A047', subtitle: 'tercegah ke TPA' },
    { title: 'Verifikasi Menunggu', value: analytics.pending_verifications ?? 0, icon: ShieldCheck, color: '#E91E63', subtitle: 'toko & kurir' },
    { title: 'Laporan Masuk', value: analytics.pending_reports ?? 0, icon: FileWarning, color: '#D32F2F', subtitle: 'perlu ditinjau' },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        borderRadius: 22, padding: 32, color: 'white', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
            {greeting}, Admin 👋
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.3 }}>
            Pantau & kelola FoodRescue dari satu dashboard.
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.12)',
            color: 'white', padding: '10px 16px', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
          }}
        >
          <RefreshCw size={16} /> {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div style={{
        background: 'white', borderRadius: 18,
        border: '1px solid #E2E8E3', padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Pengguna Terbaru</h2>
        </div>

        {loading && <p style={{ color: '#667085' }}>Loading...</p>}

        {!loading && users.length === 0 && (
          <p style={{ color: '#667085', textAlign: 'center', padding: 24 }}>
            Belum ada pengguna terdaftar.
          </p>
        )}

        {!loading && users.slice(0, 5).map((u) => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderBottom: '1px solid #F1F5F9',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#E8F5E9', color: '#2E7D32',
              display: 'grid', placeItems: 'center',
              fontWeight: 900, fontSize: 14,
            }}>
              {(u.full_name?.[0] || '?').toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{u.full_name}</div>
              <div style={{ color: '#667085', fontSize: 12 }}>{u.email}</div>
            </div>
            <div style={{
              background: u.role === 'admin' ? '#F3E5F5' : '#E3F2FD',
              color: u.role === 'admin' ? '#7B1FA2' : '#1976D2',
              padding: '3px 10px', borderRadius: 20,
              fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            }}>
              {u.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}