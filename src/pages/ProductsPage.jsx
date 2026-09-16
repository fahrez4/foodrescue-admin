import { useState } from 'react'
import { Package, Search } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

export default function ProductsPage() {
  const { products, loading, refresh } = useAdmin()
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.store_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Produk</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            Total {products.length} produk
          </p>
        </div>
        <button onClick={refresh} style={{
          border: '1px solid #D0D5DD', background: 'white',
          padding: '10px 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>🔄 Refresh</button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 10, padding: '0 14px', height: 44, marginBottom: 16,
      }}>
        <Search size={18} color="#667085" />
        <input
          type="text" value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk atau toko..."
          style={{ flex: 1, border: 0, outline: 0, padding: '0 10px', fontSize: 14 }}
        />
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: products.length === 0 ? 60 : 20,
        textAlign: products.length === 0 ? 'center' : 'left',
      }}>
        {loading && <p style={{ color: '#667085', textAlign: 'center' }}>Loading...</p>}
        {!loading && products.length === 0 && (
          <>
            <Package size={64} color="#2E7D32" style={{ marginBottom: 20 }} />
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>Belum Ada Produk</h2>
            <p style={{ color: '#667085' }}>Tambahkan produk melalui aplikasi toko atau API.</p>
          </>
        )}
        {!loading && filtered.map((p) => (
          <div key={p.id} style={{
            padding: '14px 0', borderBottom: '1px solid #F1F5F9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: '#E8F5E9', display: 'grid', placeItems: 'center',
              }}>
                <Package size={22} color="#2E7D32" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{p.title || p.name}</div>
                <div style={{ color: '#667085', fontSize: 12 }}>{p.store_name || 'Toko'}</div>
              </div>
            </div>
            <div style={{ fontWeight: 900, color: '#2E7D32' }}>
              {p.quantity || '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}