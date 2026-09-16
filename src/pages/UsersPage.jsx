import { useState, useMemo } from 'react'
import { Search, Trash2, UserX, UserCheck } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import ConfirmDialog from '../components/ConfirmDialog'

export default function UsersPage() {
  const { users, loading, deleteUser, refresh } = useAdmin()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Semua')
  const [confirm, setConfirm] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) => {
      const matchQ =
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q)
      const matchR = roleFilter === 'Semua' || u.role === roleFilter
      return matchQ && matchR
    })
  }, [users, search, roleFilter])

  const handleDelete = async () => {
    try {
      await deleteUser(confirm.id)
    } catch (e) {
      alert(e.message)
    }
    setConfirm(null)
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Pengguna</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            Total {users.length} pengguna terdaftar
          </p>
        </div>
        <button
          onClick={refresh}
          style={{
            border: '1px solid #D0D5DD', background: 'white',
            padding: '10px 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          background: 'white', border: '1px solid #E2E8E3',
          borderRadius: 10, padding: '0 14px', height: 44,
        }}>
          <Search size={18} color="#667085" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau telepon..."
            style={{ flex: 1, border: 0, outline: 0, padding: '0 10px', fontSize: 14 }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            background: 'white', border: '1px solid #E2E8E3',
            borderRadius: 10, padding: '0 14px', height: 44,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          <option>Semua</option>
          <option value="admin">Admin</option>
          <option value="superAdmin">Super Admin</option>
          <option value="storeOwner">Store Owner</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F8FAFC' }}>
            <tr>
              {['PENGGUNA', 'ROLE', 'STATUS', 'AKSI'].map((h) => (
                <th key={h} style={{
                  textAlign: 'left', padding: '14px 20px',
                  fontSize: 11, fontWeight: 900, color: '#667085',
                  letterSpacing: 0.6, borderBottom: '1px solid #E2E8E3',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Loading...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Tidak ada pengguna</td></tr>
            )}
            {!loading && filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: '#E8F5E9', color: '#2E7D32',
                      display: 'grid', placeItems: 'center',
                      fontWeight: 900,
                    }}>
                      {(u.name?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{u.name}</div>
                      <div style={{ color: '#667085', fontSize: 12 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: u.role === 'admin' ? '#F3E5F5' : u.role === 'superAdmin' ? '#FFEBEE' : '#E3F2FD',
                    color: u.role === 'admin' ? '#7B1FA2' : u.role === 'superAdmin' ? '#D32F2F' : '#1976D2',
                    padding: '4px 10px', borderRadius: 20,
                    fontSize: 11, fontWeight: 800,
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: u.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                    color: u.status === 'active' ? '#2E7D32' : '#D32F2F',
                    padding: '4px 10px', borderRadius: 20,
                    fontSize: 11, fontWeight: 800,
                  }}>
                    {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => setConfirm(u)}
                    title="Hapus pengguna"
                    style={{
                      border: 0, background: '#FFEBEE', color: '#D32F2F',
                      padding: 8, borderRadius: 8, cursor: 'pointer',
                      display: 'grid', placeItems: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Hapus Pengguna?"
        message={confirm ? `${confirm.name} (${confirm.email}) akan dihapus permanen.` : ''}
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}