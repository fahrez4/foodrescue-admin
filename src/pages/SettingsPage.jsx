import { Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Pengaturan</h1>
      <p style={{ margin: '4px 0 24px', color: '#667085' }}>
        Konfigurasi panel admin
      </p>
      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 60, textAlign: 'center',
      }}>
        <SettingsIcon size={64} color="#2E7D32" style={{ marginBottom: 20 }} />
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>Pengaturan Admin</h2>
        <p style={{ color: '#667085' }}>Profil, keamanan, dan preferensi admin.</p>
      </div>
    </div>
  )
}