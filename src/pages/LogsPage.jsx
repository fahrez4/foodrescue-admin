import { Shield, ShieldQuestion, RefreshCw, BellRing, Building2, Bike } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

export default function LogsPage() {
  const { verifications, reports, loading, refresh } = useAdmin()

  const pendingReports = reports.filter((r) => r.report_status === 'menunggu' || !r.report_status)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Audit & Aktivitas</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            Backend belum menyediakan <code>/admin/logs</code> — menampilkan antrean moderasi
            (verifikasi + laporan) yang butuh tindakan admin.
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
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 24, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BellRing size={20} color="#E65100" />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>
            Butuh Tindakan ({verifications.length + pendingReports.length})
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

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Shield size={20} color="#2E7D32" />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Tentang Audit Log</h2>
        </div>
        <p style={{ color: '#667085', lineHeight: 1.7, margin: 0 }}>
          Endpoint <code>/admin/logs</code> belum tersedia di backend FoodRescue
          (lihat <code>internal/routes/routes.go</code>). Setelah endpoint ditambahkan,
          halaman ini dapat langsung memakai <code>adminApi.logs()</code> untuk menampilkan
          jejak audit (aksi admin, IP, target, timestamps).
        </p>
      </div>
    </div>
  )
}