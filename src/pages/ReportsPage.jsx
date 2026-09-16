import { useState } from 'react'
import { Download, FileWarning, RefreshCw, CheckCircle2, Hammer, XCircle, FlaskConical } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import ConfirmDialog from '../components/ConfirmDialog'

const statusMeta = (s) => {
  switch (s) {
    case 'menunggu': return ['Menunggu', '#FFF3E0', '#E65100']
    case 'ditinjau': return ['Ditinjau', '#E8F5E9', '#2E7D32']
    case 'ditindak': return ['Ditindak', '#E3F2FD', '#1565C0']
    case 'ditolak': return ['Ditolak', '#FFEBEE', '#C62828']
    default: return [s || '—', '#F1F5F9', '#667085']
  }
}

const exportCsv = (reports) => {
  const header = ['id', 'reporter_user_id', 'reported_entity_type', 'reported_entity_id', 'reason', 'report_status', 'created_at']
  const lines = reports.map((r) =>
    header.map((k) => JSON.stringify(r[k] ?? '')).join(',')
  )
  const csv = [header.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `foodrescue-laporan-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const { reports, loading, refresh, reviewReport } = useAdmin()
  const [confirm, setConfirm] = useState(null) // {report, status}

  const handleReview = async () => {
    if (!confirm) return
    try {
      await reviewReport(confirm.report.id, confirm.status)
    } catch (e) {
      alert(e.message)
    }
    setConfirm(null)
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Laporan & Export</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            {reports.length} laporan pengguna • terhubung ke <code>/admin/reports</code>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={refresh} style={{
            border: '1px solid #D0D5DD', background: 'white',
            padding: '10px 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}><RefreshCw size={15} /> Refresh</button>
          <button onClick={() => exportCsv(reports)} style={{
            border: 0, background: '#2E7D32', color: 'white',
            padding: '10px 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}><Download size={15} /> Export CSV</button>
        </div>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, overflow: 'hidden',
      }}>
        {loading && <p style={{ textAlign: 'center', padding: 40, color: '#667085' }}>Loading...</p>}
        {!loading && reports.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <FlaskConical size={56} color="#2E7D32" style={{ marginBottom: 16 }} />
            <h2 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 900 }}>Belum Ada Laporan</h2>
            <p style={{ color: '#667085' }}>Laporan dari pengguna akan muncul di sini.</p>
          </div>
        )}
        {!loading && reports.map((r) => {
          const [label, bg, fg] = statusMeta(r.report_status)
          const isPending = r.report_status === 'menunggu' || !r.report_status
          return (
            <div key={r.id} style={{
              padding: '16px 20px', borderBottom: '1px solid #F1F5F9',
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: '#FFF3E0',
                display: 'grid', placeItems: 'center',
              }}>
                <FileWarning size={20} color="#E65100" />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>
                  {r.reported_entity_type} — {r.reported_entity_id?.slice(0, 8) || 'unknown'}
                </div>
                <div style={{ color: '#667085', fontSize: 12 }}>
                  oleh {r.reporter_user_id?.slice(0, 8)} • {r.reason || '—'}
                </div>
                <div style={{ color: '#94A3B8', fontSize: 11 }}>
                  {new Date(r.created_at).toLocaleString('id-ID')}
                </div>
              </div>
              <div style={{
                background: bg, color: fg,
                padding: '4px 10px', borderRadius: 20,
                fontSize: 11, fontWeight: 800,
              }}>
                {label}
              </div>
              {isPending && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setConfirm({ report: r, status: 'ditindak' })}
                    title="Tindak lanjut"
                    style={{
                      border: 0, background: '#E3F2FD', color: '#1565C0',
                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 12, fontWeight: 700,
                    }}
                  >
                    <Hammer size={14} /> Tindak
                  </button>
                  <button
                    onClick={() => setConfirm({ report: r, status: 'ditinjau' })}
                    title="Tandai ditinjau"
                    style={{
                      border: 0, background: '#E8F5E9', color: '#2E7D32',
                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 12, fontWeight: 700,
                    }}
                  >
                    <CheckCircle2 size={14} /> Tinjau
                  </button>
                  <button
                    onClick={() => setConfirm({ report: r, status: 'ditolak' })}
                    title="Tolak laporan"
                    style={{
                      border: 0, background: '#FFEBEE', color: '#D32F2F',
                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 12, fontWeight: 700,
                    }}
                  >
                    <XCircle size={14} /> Tolak
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Perbarui Status Laporan?"
        message={confirm
          ? `Laporan ${confirm.report.reported_entity_type} akan ditandai sebagai "${confirm.status}".`
          : ''}
        onConfirm={handleReview}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}