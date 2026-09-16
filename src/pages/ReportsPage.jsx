import { Download } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Laporan & Export</h1>
      <p style={{ margin: '4px 0 24px', color: '#667085' }}>
        Download data dalam berbagai format
      </p>
      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 60, textAlign: 'center',
      }}>
        <Download size={64} color="#2E7D32" style={{ marginBottom: 20 }} />
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>Laporan & Export</h2>
        <p style={{ color: '#667085' }}>Export CSV/JSON akan tersedia di sini.</p>
      </div>
    </div>
  )
}