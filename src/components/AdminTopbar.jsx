import { Menu, Search, Bell, LogOut } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'

export default function AdminTopbar({ title, onMenu }) {
  const { admin, logout } = useAdmin()

  return (
    <header style={{
      height: 72, background: 'white',
      borderBottom: '1px solid #E2E8E3',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 12, flexShrink: 0,
    }}>
      {onMenu && (
        <button onClick={onMenu} style={{
          border: 0, background: 'transparent', padding: 8,
          cursor: 'pointer', display: 'grid', placeItems: 'center',
        }}>
          <Menu size={22} color="#667085" />
        </button>
      )}
      <h1 style={{ flex: 1, fontSize: 22, fontWeight: 900, margin: 0, color: '#1F2933' }}>
        {title}
      </h1>
      <button style={{ border: 0, background: 'transparent', padding: 8, cursor: 'pointer' }}>
        <Search size={20} color="#667085" />
      </button>
      <button style={{ border: 0, background: 'transparent', padding: 8, cursor: 'pointer' }}>
        <Bell size={20} color="#667085" />
      </button>
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