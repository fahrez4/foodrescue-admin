import { Shield } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

export default function LogsPage() {
  const { logs, loading, refresh } = useAdmin()

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Audit Logs</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            {logs.length} aktivitas tercatat
          </p>
        </div>
        <button onClick={refresh} style={{
          border: '1px solid #D0D5DD', background: 'white',
          padding: '10px 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>🔄 Refresh</button>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: logs.length === 0 ? 60 : 0,
        textAlign: logs.length === 0 ? 'center' : 'left',
      }}>
        {loading && <p style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Loading...</p>}
        {!loading && logs.length === 0 && (
          <>
            <Shield size={64} color="#2E7D32" style={{ marginBottom: 20 }} />
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>Belum Ada Log</h2>
            <p style={{ color: '#667085' }}>Semua aksi admin akan tercatat di sini.</p>
          </>
        )}
        {!loading && logs.map((log) => (
          <div key={log.id} style={{
            padding: '14px 20px', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              background: '#E8F5E9', color: '#2E7D32',
              padding: '4px 10px', borderRadius: 6,
              fontSize: 11, fontWeight: 900,
            }}>
              {log.action}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                {log.target_type || 'system'}: {log.target_id || '-'}
              </div>
              <div style={{ color: '#667085', fontSize: 11 }}>
                IP: {log.ip_address || '-'}
              </div>
            </div>
            <div style={{ color: '#667085', fontSize: 12 }}>
              {new Date(log.created_at).toLocaleString('id-ID')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}