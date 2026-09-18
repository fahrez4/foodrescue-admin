import { useMemo, useState } from 'react'
import {
  Menu, Search, Bell, LogOut, X,
  Users as UsersIcon, Receipt, Package, ShieldCheck, FileWarning,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

export default function AdminTopbar({ title, onMenu, onNavigate }) {
  const { admin, logout, users, listings, orders, verifications, reports } = useAdmin()
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [showBell, setShowBell] = useState(false)

  const pendingReports = useMemo(
    () => reports.filter((r) => r.report_status === 'menunggu' || !r.report_status),
    [reports]
  )
  const notifCount = verifications.length + pendingReports.length

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const out = []

    users
      .filter((u) => (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((u) => out.push({ type: 'Pengguna', icon: UsersIcon, title: u.full_name, subtitle: u.email, page: 1 }))

    orders
      .filter((o) =>
        (o.confirmation_code || '').toLowerCase().includes(q) ||
        (o.buyer_name || '').toLowerCase().includes(q) ||
        (o.listing_name || '').toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((o) => out.push({
        type: 'Pesanan',
        icon: Receipt,
        title: `${o.confirmation_code} — ${o.buyer_name}`,
        subtitle: `${o.listing_name} • ${o.order_status}`,
        page: 4,
      }))

    listings
      .filter((p) => (p.name || '').toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((p) => out.push({ type: 'Produk', icon: Package, title: p.name, subtitle: p.category, page: 3 }))

    return out
  }, [query, users, orders, listings])

  const go = (page) => {
    onNavigate?.(page)
    setShowSearch(false)
    setShowBell(false)
    setQuery('')
  }

  return (
    <header style={{
      height: 72, background: 'white',
      borderBottom: '1px solid #E2E8E3',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 12, flexShrink: 0,
      position: 'relative', zIndex: 20,
    }}>
      {onMenu && (
        <button onClick={onMenu} style={{
          border: 0, background: 'transparent', padding: 8,
          cursor: 'pointer', display: 'grid', placeItems: 'center',
        }} title="Menu">
          <Menu size={22} color="#667085" />
        </button>
      )}
      <h1 style={{ flex: 1, fontSize: 22, fontWeight: 900, margin: 0, color: '#1F2933' }}>
        {title}
      </h1>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowSearch((v) => !v); setShowBell(false) }}
          style={{ border: 0, background: 'transparent', padding: 8, cursor: 'pointer' }}
          title="Cari"
        >
          <Search size={20} color="#667085" />
        </button>

        {showSearch && (
          <>
            <div onClick={() => setShowSearch(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{
              position: 'absolute', right: 0, top: 48, width: 380, maxWidth: '90vw',
              background: 'white', border: '1px solid #E2E8E3', borderRadius: 14,
              boxShadow: '0 16px 40px rgba(0,0,0,.12)', zIndex: 50, overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderBottom: '1px solid #F1F5F9',
              }}>
                <Search size={16} color="#667085" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari pengguna, pesanan, produk..."
                  style={{ flex: 1, border: 0, outline: 0, fontSize: 14 }}
                />
                {query && <X size={16} color="#667085" style={{ cursor: 'pointer' }} onClick={() => setQuery('')} />}
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {query.trim().length < 2 && (
                  <p style={{ color: '#667085', fontSize: 13, padding: 16, margin: 0 }}>
                    Ketik minimal 2 huruf untuk mencari.
                  </p>
                )}
                {query.trim().length >= 2 && results.length === 0 && (
                  <p style={{ color: '#667085', fontSize: 13, padding: 16, margin: 0 }}>
                    Tidak ada hasil untuk "{query}".
                  </p>
                )}
                {results.map((r, i) => {
                  const Icon = r.icon
                  return (
                    <button
                      key={i}
                      onClick={() => go(r.page)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '10px 14px', border: 0,
                        background: 'transparent', textAlign: 'left',
                        borderBottom: '1px solid #F8FAFC',
                      }}
                    >
                      <span style={{
                        width: 30, height: 30, borderRadius: 8, background: '#E8F5E9',
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>
                        <Icon size={15} color="#2E7D32" />
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title || '—'}</span>
                        <span style={{ display: 'block', color: '#667085', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subtitle}</span>
                      </span>
                      <span style={{ color: '#94A3B8', fontSize: 10, fontWeight: 800 }}>{r.type}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowBell((v) => !v); setShowSearch(false) }}
          style={{ border: 0, background: 'transparent', padding: 8, cursor: 'pointer', position: 'relative' }}
          title="Notifikasi"
        >
          <Bell size={20} color="#667085" />
          {notifCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16,
              borderRadius: 8, background: '#D32F2F', color: 'white',
              fontSize: 10, fontWeight: 800, display: 'grid', placeItems: 'center',
              padding: '0 4px',
            }}>{notifCount}</span>
          )}
        </button>

        {showBell && (
          <>
            <div onClick={() => setShowBell(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{
              position: 'absolute', right: 0, top: 48, width: 340, maxWidth: '90vw',
              background: 'white', border: '1px solid #E2E8E3', borderRadius: 14,
              boxShadow: '0 16px 40px rgba(0,0,0,.12)', zIndex: 50, overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', fontWeight: 900, fontSize: 14 }}>
                Notifikasi ({notifCount})
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {notifCount === 0 && (
                  <p style={{ color: '#667085', fontSize: 13, padding: 16, margin: 0 }}>
                    Tidak ada notifikasi.
                  </p>
                )}
                {verifications.map((u) => (
                  <button key={`v-${u.id}`} onClick={() => go(2)} style={notifRow}>
                    <span style={{ ...notifIcon, background: '#FFF3E0' }}><ShieldCheck size={15} color="#E65100" /></span>
                    <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <span style={notifTitle}>Verifikasi {u.role === 'kurir' ? 'Kurir' : 'Toko'}</span>
                      <span style={notifSub}>{u.business_name || u.vehicle_type || u.full_name}</span>
                    </span>
                  </button>
                ))}
                {pendingReports.map((r) => (
                  <button key={`r-${r.id}`} onClick={() => go(6)} style={notifRow}>
                    <span style={{ ...notifIcon, background: '#FFEBEE' }}><FileWarning size={15} color="#D32F2F" /></span>
                    <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <span style={notifTitle}>Laporan {r.reported_entity_type}</span>
                      <span style={notifSub}>{r.reason || 'Perlu ditinjau'}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div
        title={admin?.name || 'Admin'}
        style={{
          width: 38, height: 38, borderRadius: 8, background: '#2E7D32',
          color: 'white', display: 'grid', placeItems: 'center',
          fontWeight: 900, fontSize: 14, marginLeft: 8,
        }}
      >
        {(admin?.name?.[0] || 'A').toUpperCase()}
      </div>
      <button
        onClick={logout}
        title="Logout"
        style={{
          border: 0, background: 'transparent', padding: 8,
          cursor: 'pointer', display: 'grid', placeItems: 'center',
        }}
      >
        <LogOut size={20} color="#D32F2F" />
      </button>
    </header>
  )
}

const notifRow = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%', padding: '10px 14px', border: 0,
  background: 'transparent', borderBottom: '1px solid #F8FAFC', cursor: 'pointer',
}
const notifIcon = {
  width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0,
}
const notifTitle = { display: 'block', fontWeight: 700, fontSize: 13 }
const notifSub = { display: 'block', color: '#667085', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
