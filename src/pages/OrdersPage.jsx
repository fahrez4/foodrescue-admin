import { Receipt } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Pesanan</h1>
      <p style={{ margin: '4px 0 24px', color: '#667085' }}>
        Semua transaksi pengguna
      </p>
      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 60, textAlign: 'center',
      }}>
        <Receipt size={64} color="#2E7D32" style={{ marginBottom: 20 }} />
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>Manajemen Pesanan</h2>
        <p style={{ color: '#667085' }}>
          Fitur ini akan segera tersedia. Endpoint BE: <code>/api/v1/admin/orders</code>
        </p>
      </div>
    </div>
  )
}