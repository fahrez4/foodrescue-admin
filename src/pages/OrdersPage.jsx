import { Receipt, CheckCircle2, Wallet, Leaf, RefreshCw, Info } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import StatCard from '../components/StatCard'

const fmtRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

export default function OrdersPage() {
  const { analytics, refresh } = useAdmin()

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Pesanan</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            Ringkasan transaksi dari <code>/admin/dashboard</code>
          </p>
        </div>
        <button onClick={refresh} style={{
          border: '1px solid #D0D5DD', background: 'white',
          padding: '10px 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        <StatCard title="Total Pesanan" value={analytics.total_orders ?? 0} icon={Receipt} color="#F57C00" subtitle="semua status" />
        <StatCard title="Pesanan Selesai" value={analytics.completed_orders ?? 0} icon={CheckCircle2} color="#2E7D32" subtitle="order_status = selesai" />
        <StatCard title="Pendapatan" value={fmtRp(analytics.total_revenue)} icon={Wallet} color="#1976D2" subtitle="dari pesanan lunas" />
        <StatCard title="Makanan Terselamatkan" value={`${(analytics.total_food_saved_kg ?? 0).toFixed(1)} kg`} icon={Leaf} color="#43A047" subtitle="tercegah masuk TPA" />
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 56, textAlign: 'center',
      }}>
        <Receipt size={56} color="#2E7D32" style={{ marginBottom: 16 }} />
        <h2 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 900 }}>Detail Pesanan per Item</h2>
        <p style={{ color: '#667085', margin: '0 auto', maxWidth: 480, lineHeight: 1.6 }}>
          Backend belum menyediakan <code>/admin/orders</code> (daftar detail per transaksi).
          Panel ini menampilkan ringkasan agregat yang tersedia. Menambahkan endpoint detail
          per item adalah item kerja backend berikutnya.
        </p>
        <div style={{
          marginTop: 20, display: 'inline-flex', gap: 8, alignItems: 'center',
          background: '#E8F5E9', padding: '10px 16px', borderRadius: 10,
          fontSize: 13, fontWeight: 700, color: '#2E7D32',
        }}>
          <Info size={16} /> Ringkasan terhubung langsung ke API produksi.
        </div>
      </div>
    </div>
  )
}