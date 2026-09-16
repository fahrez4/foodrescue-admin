import { useMemo, useState } from 'react'
import { Receipt, CheckCircle2, Wallet, Leaf, RefreshCw, Search, Trash2, Save } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import StatCard from '../components/StatCard'
import ConfirmDialog from '../components/ConfirmDialog'

const fmtRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

export default function OrdersPage() {
  const { analytics, orders, loading, refresh, updateOrder, deleteOrder } = useAdmin()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [draftStatuses, setDraftStatuses] = useState({})
  const [confirm, setConfirm] = useState(null)

  const statusOptions = ['pending', 'confirmed', 'processing', 'ready', 'picked_up', 'completed', 'cancelled']
  const statusLabel = (status) => (status || 'unknown').replaceAll('_', ' ')
  const orderValue = (order) => order.total_amount ?? order.total_price ?? order.amount ?? order.total ?? 0
  const orderCustomer = (order) => order.user_name || order.customer_name || order.user?.full_name || order.user_id || '—'
  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase()
    return orders.filter((order) => {
      const status = order.order_status || order.status || ''
      const matchesStatus = !statusFilter || status === statusFilter
      const matchesQuery = !query || String(order.id).toLowerCase().includes(query) || orderCustomer(order).toLowerCase().includes(query)
      return matchesStatus && matchesQuery
    })
  }, [orders, search, statusFilter])

  const saveStatus = async (order) => {
    const status = draftStatuses[order.id] || order.order_status || order.status
    try {
      await updateOrder(order.id, { order_status: status, status })
      setDraftStatuses((previous) => { const next = { ...previous }; delete next[order.id]; return next })
    } catch (error) { alert(error.message) }
  }

  const removeOrder = async () => {
    try { await deleteOrder(confirm.id) } catch (error) { alert(error.message) }
    setConfirm(null)
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Pesanan</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            {orders.length} transaksi terhubung ke <code>/admin/orders</code>
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #E2E8E3', borderRadius: 10, padding: '0 14px', height: 44 }}>
          <Search size={18} color="#667085" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari ID atau pelanggan..." style={{ flex: 1, border: 0, outline: 0, padding: '0 10px', fontSize: 14 }} />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ background: 'white', border: '1px solid #E2E8E3', borderRadius: 10, padding: '0 14px', height: 44, fontSize: 13 }}>
          <option value="">Semua status</option>
          {statusOptions.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
        </select>
      </div>

      <div style={{ background: 'white', border: '1px solid #E2E8E3', borderRadius: 18, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead style={{ background: '#F8FAFC' }}><tr>
            {['PESANAN', 'PELANGGAN', 'TOTAL', 'STATUS', 'DIBUAT', 'AKSI'].map((heading) => <th key={heading} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11, color: '#667085', borderBottom: '1px solid #E2E8E3' }}>{heading}</th>)}
          </tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Loading...</td></tr>}
            {!loading && filteredOrders.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Belum ada pesanan atau endpoint belum tersedia.</td></tr>}
            {!loading && filteredOrders.map((order) => {
              const currentStatus = draftStatuses[order.id] || order.order_status || order.status || 'pending'
              return <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 800 }}>{String(order.id).slice(0, 12)}</td>
                <td style={{ padding: '14px 20px', color: '#475467' }}>{orderCustomer(order)}</td>
                <td style={{ padding: '14px 20px', fontWeight: 800, color: '#2E7D32' }}>{fmtRp(orderValue(order))}</td>
                <td style={{ padding: '14px 20px' }}><select value={currentStatus} onChange={(event) => setDraftStatuses((previous) => ({ ...previous, [order.id]: event.target.value }))} style={{ border: '1px solid #D0D5DD', borderRadius: 8, padding: '7px 9px', textTransform: 'capitalize' }}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></td>
                <td style={{ padding: '14px 20px', color: '#667085', fontSize: 12 }}>{order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '—'}</td>
                <td style={{ padding: '14px 20px' }}><div style={{ display: 'flex', gap: 6 }}><button onClick={() => saveStatus(order)} title="Simpan status" style={{ border: 0, background: '#E8F5E9', color: '#2E7D32', padding: 8, borderRadius: 8, cursor: 'pointer' }}><Save size={15} /></button><button onClick={() => setConfirm(order)} title="Hapus pesanan" style={{ border: 0, background: '#FFEBEE', color: '#D32F2F', padding: 8, borderRadius: 8, cursor: 'pointer' }}><Trash2 size={15} /></button></div></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog open={Boolean(confirm)} title="Hapus Pesanan?" message={confirm ? `Pesanan ${String(confirm.id).slice(0, 12)} akan dihapus permanen.` : ''} danger onConfirm={removeOrder} onCancel={() => setConfirm(null)} />
    </div>
  )
}