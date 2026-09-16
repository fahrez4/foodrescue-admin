import { useEffect, useState } from 'react'
import { Users, Package, Shield, TrendingUp, Activity } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import StatCard from '../components/StatCard'

export default function DashboardPage() {
  const { stats, users, loading, refresh } = useAdmin()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Selamat pagi')
    else if (hour < 18) setGreeting('Selamat siang')
    else setGreeting('Selamat malam')
  }, [])

  return (
    <div style={{ padding: 24 }}>
      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        borderRadius: 22, padding: 32, color: 'white', marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
          {greeting}, Super Admin 👋
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.3 }}>
          Pantau & kelola FoodRescue dari satu dashboard.
        </div>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        <StatCard
          title="Total Pengguna"
          value={stats.totalUsers}
          icon={Users}
          color="#2E7D32"
          change="+12%"
          subtitle={`${stats.activeUsers} aktif`}
        />
        <StatCard
          title="Total Produk"
          value={stats.totalProducts}
          icon={Package}
          color="#1976D2"
          change="+5%"
          subtitle="di platform"
        />
        <StatCard
          title="Audit Logs"
          value={stats.totalLogs}
          icon={Shield}
          color="#FF9800"
          change="+18%"
          subtitle="aktivitas tercatat"
        />
        <StatCard
          title="Status Sistem"
          value="Online"
          icon={Activity}
          color="#7B1FA2"
          subtitle="BE :8091"
        />
      </div>

      {/* Recent users */}
      <div style={{
        background: 'white', borderRadius: 18,
        border: '1px solid #E2E8E3', padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Pengguna Terbaru</h2>
          <button
            onClick={refresh}
            style={{
              border: '1px solid #D0D5DD', background: 'white',
              padding: '6px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            🔄 Refresh
          </button>
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
              {(u.name?.[0] || '?').toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
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