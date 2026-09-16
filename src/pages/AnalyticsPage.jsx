import { TrendingUp, Users, Store, Bike, Receipt, CheckCircle2, Wallet, Leaf, ShieldCheck, FileWarning } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

const fmtRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

const rows = [
  { key: 'total_users', label: 'Pengguna', icon: Users, color: '#2E7D32', fn: (v) => v ?? 0 },
  { key: 'total_toko', label: 'Toko', icon: Store, color: '#1976D2', fn: (v) => v ?? 0 },
  { key: 'total_kurir', label: 'Kurir', icon: Bike, color: '#7B1FA2', fn: (v) => v ?? 0 },
  { key: 'total_admin', label: 'Admin', icon: ShieldCheck, color: '#455A64', fn: (v) => v ?? 0 },
  { key: 'total_orders', label: 'Pesanan', icon: Receipt, color: '#F57C00', fn: (v) => v ?? 0 },
  { key: 'completed_orders', label: 'Pesanan Selesai', icon: CheckCircle2, color: '#2E7D32', fn: (v) => v ?? 0 },
  { key: 'total_revenue', label: 'Pendapatan', icon: Wallet, color: '#00897B', fn: fmtRp },
  { key: 'total_food_saved_kg', label: 'Makanan Terselamatkan (kg)', icon: Leaf, color: '#43A047', fn: (v) => (v ?? 0).toFixed(1) },
  { key: 'pending_verifications', label: 'Verifikasi Menunggu', icon: ShieldCheck, color: '#E91E63', fn: (v) => v ?? 0 },
  { key: 'pending_reports', label: 'Laporan Menunggu', icon: FileWarning, color: '#D32F2F', fn: (v) => v ?? 0 },
]

function maxOf(list, analytics) {
  return Math.max(1, ...list.map((r) => Number(analytics[r.key]) || 0))
}

export default function AnalyticsPage() {
  const { analytics } = useAdmin()
  const max = maxOf(rows, analytics)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, background: '#E8F5E9',
          display: 'grid', placeItems: 'center',
        }}>
          <TrendingUp size={22} color="#2E7D32" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Analytics</h1>
          <p style={{ margin: '2px 0 0', color: '#667085' }}>
            Statistik langsung dari <code>/admin/dashboard</code>
          </p>
        </div>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 28,
      }}>
        {rows.map((r) => {
          const value = analytics[r.key]
          const iconColor = r.color
          return (
            <div key={r.key} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 30, height: 30, borderRadius: 8, background: `${iconColor}18`,
                    display: 'grid', placeItems: 'center',
                  }}>
                    <r.icon size={16} color={iconColor} />
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{r.label}</span>
                </div>
                <span style={{ fontWeight: 900, fontSize: 16, color: iconColor }}>
                  {r.fn(value)}
                </span>
              </div>
              <div style={{ height: 10, background: '#F1F5F9', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 8, background: iconColor,
                  width: `${(Number(value) || 0) / max * 100}%`,
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}