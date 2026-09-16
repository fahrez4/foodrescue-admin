import { useState, useMemo } from 'react'
import { Package, Search, RefreshCw, Flame, Plus, Pencil, Trash2 } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import AdminFormDialog from '../components/AdminFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'

const fmtRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

export default function ProductsPage() {
  const { listings, tokos, loading, refresh, storeNameById, saveListing, deleteListing } = useAdmin()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [formListing, setFormListing] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [confirm, setConfirm] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fields = [
    { name: 'name', label: 'Nama produk', required: true },
    { name: 'toko_id', label: 'Toko', type: 'select', required: true, options: tokos.map((toko) => ({ value: toko.id, label: toko.business_name })) },
    { name: 'category', label: 'Kategori', required: true },
    { name: 'initial_price', label: 'Harga awal', type: 'number', min: 0, required: true },
    { name: 'current_price', label: 'Harga jual', type: 'number', min: 0, required: true },
    { name: 'stock_quantity', label: 'Stok', type: 'number', min: 0, required: true },
    { name: 'status', label: 'Status', type: 'select', required: true, options: [
      { value: 'active', label: 'Aktif' }, { value: 'sold_out', label: 'Habis' }, { value: 'inactive', label: 'Nonaktif' },
    ] },
  ]

  const openForm = (listing = null) => {
    setFormListing(listing)
    setFormValues(listing ? { ...listing } : { name: '', toko_id: tokos[0]?.id || '', category: '', initial_price: '', current_price: '', stock_quantity: 0, status: 'active' })
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await saveListing(formListing?.id, { ...formValues, initial_price: Number(formValues.initial_price), current_price: Number(formValues.current_price), stock_quantity: Number(formValues.stock_quantity) })
      setFormListing(null); setFormValues({})
    } catch (e) { alert(e.message) } finally { setSubmitting(false) }
  }

  const removeListing = async () => {
    try { await deleteListing(confirm.id) } catch (e) { alert(e.message) }
    setConfirm(null)
  }

  const categories = useMemo(
    () => ['Semua', ...new Set(listings.map((p) => p.category).filter(Boolean))],
    [listings]
  )

  const filtered = listings.filter((p) => {
    const q = search.toLowerCase()
    const matchQ =
      (p.name || '').toLowerCase().includes(q) ||
      storeNameById(p.toko_id).toLowerCase().includes(q)
    const matchC = !catFilter || catFilter === 'Semua' || p.category === catFilter
    return matchQ && matchC
  })

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Produk</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            {listings.length} makanan terselamatkan aktif
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => openForm()} style={{ border: 0, background: '#2E7D32', color: 'white', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Tambah Produk</button>
        <button onClick={refresh} style={{
          border: '1px solid #D0D5DD', background: 'white',
          padding: '10px 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}><RefreshCw size={15} /> Refresh</button></div>
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
            placeholder="Cari produk atau toko..."
            style={{ flex: 1, border: 0, outline: 0, padding: '0 10px', fontSize: 14 }}
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          style={{
            background: 'white', border: '1px solid #E2E8E3',
            borderRadius: 10, padding: '0 14px', height: 44,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: listings.length === 0 ? 60 : 20,
        textAlign: listings.length === 0 ? 'center' : 'left',
      }}>
        {loading && <p style={{ color: '#667085', textAlign: 'center' }}>Loading...</p>}
        {!loading && listings.length === 0 && (
          <>
            <Package size={64} color="#2E7D32" style={{ marginBottom: 20 }} />
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>Belum Ada Produk</h2>
            <p style={{ color: '#667085' }}>Toko dapat menambahkan melalui aplikasi toko.</p>
          </>
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ color: '#667085', textAlign: 'center', padding: 24 }}>Tidak ada produk cocok.</p>
        )}
        {!loading && filtered.map((p) => (
          <div key={p.id} style={{
            padding: '14px 0', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: '#E8F5E9', display: 'grid', placeItems: 'center',
            }}>
              <Package size={22} color="#2E7D32" />
            </div>
            <div style={{ flex: 1, minWidth: 170 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{p.name}</div>
              <div style={{ color: '#667085', fontSize: 12 }}>
                {storeNameById(p.toko_id)} • {p.category || '—'}
              </div>
            </div>
            <div style={{ color: '#667085', background: '#F1F5F9', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
              Sisa {p.stock_quantity} porsi
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900, color: '#2E7D32' }}>
                {fmtRp(p.current_price)}
              </div>
              <div style={{ color: '#94A3B8', fontSize: 11, textDecoration: 'line-through' }}>
                {fmtRp(p.initial_price)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => openForm(p)} title="Edit produk" style={{ border: 0, background: '#E3F2FD', color: '#1565C0', padding: 8, borderRadius: 8, cursor: 'pointer' }}><Pencil size={15} /></button>
              <button onClick={() => setConfirm(p)} title="Hapus produk" style={{ border: 0, background: '#FFEBEE', color: '#D32F2F', padding: 8, borderRadius: 8, cursor: 'pointer' }}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {!loading && listings.length > 0 && (
        <div style={{
          marginTop: 16, display: 'flex', gap: 8, alignItems: 'center',
          background: '#FFF8E1', padding: '12px 16px', borderRadius: 12,
          fontSize: 13, color: '#E65100',
        }}>
          <Flame size={16} />
          Harga naik dinamis terhadap waktu — semakin dekat ke safe_until, semakin murah. Listing dengan status selain aktif tidak ditampilkan.
        </div>
      )}

      <ConfirmDialog open={Boolean(confirm)} title="Hapus Produk?" message={confirm ? `${confirm.name} akan dihapus permanen.` : ''} danger onConfirm={removeListing} onCancel={() => setConfirm(null)} />
      <AdminFormDialog open={Boolean(formListing) || Object.keys(formValues).length > 0} title={formListing ? 'Edit Produk' : 'Tambah Produk'} fields={fields} values={formValues} onChange={(name, value) => setFormValues((prev) => ({ ...prev, [name]: value }))} onSubmit={submitForm} onCancel={() => { setFormListing(null); setFormValues({}) }} submitting={submitting} />
    </div>
  )
}