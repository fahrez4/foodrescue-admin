import { useState, useMemo } from 'react'
import { Search, Trash2, Ban, RefreshCw, Plus, Pencil } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import ConfirmDialog from '../components/ConfirmDialog'
import AdminFormDialog from '../components/AdminFormDialog'

const statusLabel = (status) => {
  switch (status) {
    case 'active': return ['Aktif', '#E8F5E9', '#2E7D32']
    case 'suspended': return ['Diblokir', '#FFEBEE', '#D32F2F']
    case 'pending_verification': return ['Menunggu Verifikasi', '#FFF3E0', '#E65100']
    case 'rejected': return ['Ditolak', '#FFEBEE', '#C62828']
    default: return [status || '—', '#F1F5F9', '#667085']
  }
}

export default function UsersPage() {
  const { users, loading, deleteUser, deactivateUser, createUser, updateUser, refresh } = useAdmin()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [confirm, setConfirm] = useState(null) // {type:'delete'|'ban', user}
  const [formUser, setFormUser] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const userFields = [
    { name: 'full_name', label: 'Nama lengkap', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: !formUser, placeholder: formUser ? 'Kosongkan jika tidak diubah' : '' },
    { name: 'role', label: 'Role', type: 'select', required: true, options: [
      { value: 'user', label: 'Customer' }, { value: 'toko', label: 'Store Owner' },
      { value: 'kurir', label: 'Kurir' }, { value: 'admin', label: 'Admin' },
    ] },
    { name: 'account_status', label: 'Status', type: 'select', required: true, options: [
      { value: 'active', label: 'Aktif' }, { value: 'suspended', label: 'Diblokir' },
      { value: 'pending_verification', label: 'Menunggu Verifikasi' },
    ] },
  ]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) => {
      const matchQ =
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      const matchR = !roleFilter || u.role === roleFilter
      return matchQ && matchR
    })
  }, [users, search, roleFilter])

  const handleAction = async () => {
    if (!confirm) return
    try {
      if (confirm.type === 'delete') await deleteUser(confirm.user.id)
      else await deactivateUser(confirm.user.id)
    } catch (e) {
      alert(e.message)
    }
    setConfirm(null)
  }

  const openUserForm = (user = null) => {
    setFormUser(user)
    setFormValues(user
      ? { full_name: user.full_name || '', email: user.email || '', role: user.role || 'user', account_status: user.account_status || 'active' }
      : { full_name: '', email: '', password: '', role: 'user', account_status: 'active' })
  }

  const handleUserSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...formValues }
      if (!payload.password) delete payload.password
      if (formUser) await updateUser(formUser.id, payload)
      else await createUser(payload)
      setFormUser(null)
      setFormValues({})
    } catch (e) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
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
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => openUserForm()} style={{
            border: 0, background: '#2E7D32', color: 'white', padding: '10px 18px',
            borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}><Plus size={15} /> Tambah Pengguna</button>
          <button
            onClick={refresh}
            style={{
            border: '1px solid #D0D5DD', background: 'white',
            padding: '10px 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
              <RefreshCw size={15} /> Refresh
          </button>
        </div>
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
            placeholder="Cari nama atau email..."
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
          <option value="">Semua Role</option>
          <option value="user">Customer</option>
          <option value="toko">Store Owner</option>
          <option value="kurir">Kurir</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F8FAFC' }}>
            <tr>
              {['PENGGUNA', 'ROLE', 'TRUST', 'STATUS', 'AKSI'].map((h) => (
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
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Loading...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#667085' }}>Tidak ada pengguna</td></tr>
            )}
            {!loading && filtered.map((u) => {
              const [label, bg, fg] = statusLabel(u.account_status)
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: '#E8F5E9', color: '#2E7D32',
                        display: 'grid', placeItems: 'center',
                        fontWeight: 900,
                      }}>
                        {(u.full_name?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{u.full_name}</div>
                        <div style={{ color: '#667085', fontSize: 12 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: u.role === 'admin' ? '#F3E5F5' : u.role === 'kurir' ? '#EDE7F6' : '#E3F2FD',
                      color: u.role === 'admin' ? '#7B1FA2' : u.role === 'kurir' ? '#4527A0' : '#1976D2',
                      padding: '4px 10px', borderRadius: 20,
                      fontSize: 11, fontWeight: 800, textTransform: 'capitalize',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#667085', fontSize: 13 }}>
                    {u.trust_score ?? '-'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: bg, color: fg,
                      padding: '4px 10px', borderRadius: 20,
                      fontSize: 11, fontWeight: 800,
                    }}>
                      {label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => openUserForm(u)}
                        title="Edit pengguna"
                        style={{ border: 0, background: '#E3F2FD', color: '#1565C0', padding: 8, borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                      ><Pencil size={16} /></button>
                      {u.account_status !== 'suspended' && (
                        <button
                          onClick={() => setConfirm({ type: 'ban', user: u })}
                          title="Blokir pengguna"
                          style={{
                            border: 0, background: '#FFF3E0', color: '#E65100',
                            padding: 8, borderRadius: 8, cursor: 'pointer',
                            display: 'grid', placeItems: 'center',
                          }}
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => setConfirm({ type: 'delete', user: u })}
                        title="Hapus pengguna"
                        style={{
                          border: 0, background: '#FFEBEE', color: '#D32F2F',
                          padding: 8, borderRadius: 8, cursor: 'pointer',
                          display: 'grid', placeItems: 'center',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.type === 'delete' ? 'Hapus Pengguna?' : 'Blokir Pengguna?'}
        message={confirm
          ? confirm.type === 'delete'
            ? `${confirm.user.full_name} (${confirm.user.email}) akan dihapus permanen.`
            : `${confirm.user.full_name} (${confirm.user.email}) akan diblokir (suspended).`
          : ''}
        danger={confirm?.type === 'delete'}
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />

      <AdminFormDialog
        open={Boolean(formUser) || formUser === null && Object.keys(formValues).length > 0}
        title={formUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
        fields={userFields}
        values={formValues}
        onChange={(name, value) => setFormValues((prev) => ({ ...prev, [name]: value }))}
        onSubmit={handleUserSubmit}
        onCancel={() => { setFormUser(null); setFormValues({}) }}
        submitting={submitting}
      />
    </div>
  )
}