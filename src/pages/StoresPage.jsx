import { Store } from 'lucide-react'

export default function StoresPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Toko</h1>
      <p style={{ margin: '4px 0 24px', color: '#667085' }}>
        Daftar toko mitra FoodRescue
      </p>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 60, textAlign: 'center',
      }}>
        <Store size={64} color="#2E7D32" style={{ marginBottom: 20 }} />
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>
          Manajemen Toko
        </h2>
        <p style={{ color: '#667085', marginBottom: 24 }}>
          Fitur ini akan segera tersedia. Endpoint BE: <code>/api/v1/admin/stores</code>
        </p>
      </div>
    </div>
  )
}