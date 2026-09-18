import { Shield, ShieldQuestion, RefreshCw, BellRing, Building2, Bike, History } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

const actionMeta = (action) => {
  switch (action) {
    case 'verify_user': return ['Verifikasi Pengguna', '#E8F5E9', '#2E7D32']
    case 'deactivate_user': return ['Blokir Pengguna', '#FFF3E0', '#E65100']
    case 'delete_user': return ['Hapus Pengguna', '#FFEBEE', '#D32F2F']
    case 'review_report': return ['Tinjau Laporan', '#E3F2FD', '#1565C0']
    case 'verify_ngo': return ['Verifikasi NGO', '#F3E5F5', '#7B1FA2']
    case 'update_order_status': return ['Ubah Status Pesanan', '#E0F2F1', '#00695C']
    default: return [action || 'Aksi', '#F1F5F9', '#667085']
  }
}

export default function LogsPage() {
  const { verifications, reports, logs, loading, refresh } = useAdmin()

  const pendingReports = reports.filter((r) => r.report_status === 'menunggu' || !r.report_status)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Audit & Aktivitas</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            {logs.length} aksi admin tercatat • terhubung ke <code>/admin/logs</code>
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
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 24, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <History size={20} color="#2E7D32" />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>
            Jejak Audit Admin ({logs.length})
          </h2>
        </div>
        {loading && <p style={{ color: '#667085' }}>Loading...</p>}
        {!loading && logs.length === 0 && (
          <p style={{ color: '#667085', textAlign: 'center', padding: 24 }}>
            Belum ada aksi admin yang tercatat.
          </p>
        )}
        {!loading && logs.map((l) => {
          const [label, bg, fg] = actionMeta(l.action)
          return (
            <div key={l.id} style={{
              padding: '12px 0', borderBottom: '1px solid #F1F5F9',
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: bg,
                display: 'grid', placeItems: 'center',
              }}>
                <Shield size={16} color={fg} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{l.description || label}</div>
                <div style={{ color: '#667085', fontSize: 12 }}>
                  {l.admin_name || 'Admin'} • {l.target_type} {l.target_id ? l.target_id.slice(0, 8) : ''}
                </div>
              </div>
              <div style={{ color: '#94A3B8', fontSize: 11 }}>
                {new Date(l.created_at).toLocaleString('id-ID')}
              </div>
              <span style={{
                background: bg, color: fg,
                padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
              }}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BellRing size={20} color="#E65100" />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>
            Antrean Moderasi ({verifications.length + pendingReports.length})
          </h2>
        </div>
        {loading && <p style={{ color: '#667085' }}>Loading...</p>}
        {!loading && verifications.length === 0 && pendingReports.length === 0 && (
          <p style={{ color: '#667085', textAlign: 'center', padding: 24 }}>
            Tidak ada aktivitas yang menunggu tindakan.
          </p>
        )}
        {!loading && verifications.map((u) => (
          <div key={`v-${u.id}`} style={{
            padding: '12px 0', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: u.role === 'kurir' ? '#EDE7F6' : '#F3E5F5',
              display: 'grid', placeItems: 'center',
            }}>
              {u.role === 'kurir'
                ? <Bike size={16} color="#4527A0" />
                : <Building2 size={16} color="#7B1FA2" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                {u.business_name || u.vehicle_type || u.full_name}
              </div>
              <div style={{ color: '#667085', fontSize: 12 }}>
                {u.full_name} • {u.email}
              </div>
            </div>
            <span style={{
              background: '#FFF3E0', color: '#E65100',
              padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
            }}>
              VERIFIKASI
            </span>
          </div>
        ))}
        {!loading && pendingReports.map((r) => (
          <div key={`r-${r.id}`} style={{
            padding: '12px 0', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: '#FFEBEE',
              display: 'grid', placeItems: 'center',
            }}>
              <ShieldQuestion size={16} color="#D32F2F" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                Laporan {r.reported_entity_type}
              </div>
              <div style={{ color: '#667085', fontSize: 12 }}>
                {r.reason} • {new Date(r.created_at).toLocaleString('id-ID')}
              </div>
            </div>
            <span style={{
              background: '#FFEBEE', color: '#D32F2F',
              padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
            }}>
              LAPORAN
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
