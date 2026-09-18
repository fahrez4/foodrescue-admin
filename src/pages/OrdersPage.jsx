import { useState, useMemo } from 'react'
import {
  Receipt, CheckCircle2, Wallet, Leaf, RefreshCw,
  Search, XCircle, RotateCcw, Bike, Store,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import StatCard from '../components/StatCard'
import ConfirmDialog from '../components/ConfirmDialog'

const fmtRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

const orderMeta = (s) => {
  switch (s) {
    case 'menunggu_pickup': return ['Menunggu Pickup', '#FFF3E0', '#E65100']
    case 'selesai': return ['Selesai', '#E8F5E9', '#2E7D32']
    case 'dibatalkan': return ['Dibatalkan', '#FFEBEE', '#D32F2F']
    default: return [s || '—', '#F1F5F9', '#667085']
  }
}

const payMeta = (s) => {
  switch (s) {
    case 'paid': return ['Lunas', '#E8F5E9', '#2E7D32']
    case 'unpaid': return ['Belum Bayar', '#FFF3E0', '#E65100']
    default: return [s || '—', '#F1F5F9', '#667085']
  }
}

const fulfillLabel = (m) =>
  m === 'diantar_kurir' ? 'Diantar Kurir' : m === 'pickup_mandiri' ? 'Pickup Mandiri' : (m || '—')

export default function OrdersPage() {
  const { orders, analytics, loading, refresh, updateOrderStatus } = useAdmin()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter((o) => {
      const matchQ =
        !q ||
        (o.buyer_name || '').toLowerCase().includes(q) ||
        (o.buyer_email || '').toLowerCase().includes(q) ||
        (o.listing_name || '').toLowerCase().includes(q) ||
        (o.toko_name || '').toLowerCase().includes(q) ||
        (o.confirmation_code || '').toLowerCase().includes(q)
      const matchS = !statusFilter || o.order_status === statusFilter
      return matchQ && matchS
    })
  }, [orders, search, statusFilter])

  const handleAction = async () => {
    if (!confirm) return
    setBusy(true)
    try {
      await updateOrderStatus(confirm.order.id, confirm.status)
    } catch (e) {
      alert(e.message)
    }
    setBusy(false)
    setConfirm(null)
  }

  const actionButtons = (o) => {
    if (o.order_status === 'selesai') {
      return (
        <button
          onClick={() => setConfirm({ order: o, status: 'dibatalkan', label: 'Batalkan Pesanan?', danger: true })}
          style={btn('#FFEBEE', '#D32F2F')}
        >
          <XCircle size={14} /> Batalkan
        </button>
      )
    }
    if (o.order_status === 'dibatalkan') {
      return (
        <button
          onClick={() => setConfirm({ order: o, status: 'menunggu_pickup', label: 'Pulihkan Pesanan?' })}
          style={btn('#E3F2FD', '#1565C0')}
        >
          <RotateCcw size={14} /> Pulihkan
        </button>
      )
    }
    return (
      <>
        <button
          onClick={() => setConfirm({ order: o, status: 'selesai', label: 'Tandai Pesanan Selesai?' })}
          style={btn('#E8F5E9', '#2E7D32')}
        >
          <CheckCircle2 size={14} /> Selesai
        </button>
        <button
          onClick={() => setConfirm({ order: o, status: 'dibatalkan', label: 'Batalkan Pesanan?', danger: true })}
          style={btn('#FFEBEE', '#D32F2F')}
        >
          <XCircle size={14} /> Batalkan
        </button>
      </>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Pesanan</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            {orders.length} transaksi • terhubung ke <code>/admin/orders</code>
          </p>
        </div>
        <button onClick={refresh} disabled={loading} style={{
          border: '1px solid #D0D5DD', background: 'white',
          padding: '10px 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}><RefreshCw size={15} /> {loading ? 'Memuat...' : 'Refresh'}</button>
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          background: 'white', border: '1px solid #E2E8E3',
          borderRadius: 10, padding: '0 14px', height: 44,
        }}>
          <Search size={18} color="#667085" />
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode, pembeli, produk, atau toko..."
            style={{ flex: 1, border: 0, outline: 0, padding: '0 10px', fontSize: 14 }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: 'white', border: '1px solid #E2E8E3',
            borderRadius: 10, padding: '0 14px', height: 44,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          <option value="">Semua Status</option>
          <option value="menunggu_pickup">Menunggu Pickup</option>
          <option value="selesai">Selesai</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F8FAFC' }}>
            <tr>
              {['KODE', 'PEMBELI', 'PRODUK / TOKO', 'TOTAL', 'PEMBAYARAN', 'STATUS', 'AKSI'].map((h) => (
                <th key={h} style={{
                  textAlign: 'left', padding: '14px 16px',
                  fontSize: 11, fontWeight: 900, color: '#667085',
                  letterSpacing: 0.6, borderBottom: '1px solid #E2E8E3',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Loading...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center' }}>
                <Receipt size={48} color="#2E7D32" style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 800 }}>Belum ada pesanan</div>
                <div style={{ color: '#667085', fontSize: 13 }}>Pesanan pengguna akan muncul di sini.</div>
              </td></tr>
            )}
            {!loading && filtered.map((o) => {
              const [oLabel, oBg, oFg] = orderMeta(o.order_status)
              const [pLabel, pBg, pFg] = payMeta(o.payment_status)
              return (
                <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{o.confirmation_code || '—'}</div>
                    <div style={{ color: '#94A3B8', fontSize: 11 }}>
                      {new Date(o.created_at).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{o.buyer_name || 'Pengguna'}</div>
                    <div style={{ color: '#667085', fontSize: 11 }}>{o.buyer_email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{o.listing_name || '—'}</div>
                    <div style={{ color: '#667085', fontSize: 11, display: 'flex', gap: 6, alignItems: 'center' }}>
                      <Store size={12} /> {o.toko_name || 'Toko'} • {o.quantity}x
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 900, color: '#2E7D32', fontSize: 13 }}>{fmtRp(o.total_amount)}</div>
                    <div style={{ color: '#667085', fontSize: 11, display: 'flex', gap: 5, alignItems: 'center' }}>
                      {o.fulfillment_method === 'diantar_kurir' && <Bike size={12} />}
                      {fulfillLabel(o.fulfillment_method)}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: pBg, color: pFg, padding: '4px 10px',
                      borderRadius: 20, fontSize: 11, fontWeight: 800,
                    }}>{pLabel}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: oBg, color: oFg, padding: '4px 10px',
                      borderRadius: 20, fontSize: 11, fontWeight: 800,
                    }}>{oLabel}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {actionButtons(o)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.label || 'Ubah Status Pesanan?'}
        message={confirm
          ? `Pesanan ${confirm.order.confirmation_code} (${confirm.order.buyer_name}) akan diubah menjadi "${confirm.status}".`
          : ''}
        danger={Boolean(confirm?.danger)}
        loading={busy}
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}

function btn(bg, color) {
  return {
    border: 0, background: bg, color,
    padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 12, fontWeight: 700,
  }
}
