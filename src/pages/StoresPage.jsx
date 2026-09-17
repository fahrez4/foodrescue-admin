import { useState } from 'react'
import { Store, CheckCircle2, XCircle, Building2, Bike, RefreshCw, Star, Plus, Pencil, Trash2 } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import ConfirmDialog from '../components/ConfirmDialog'
import AdminFormDialog from '../components/AdminFormDialog'

export default function StoresPage() {
  const { tokos, verifications, loading, refresh, verifyUser, saveToko, deleteToko } = useAdmin()
  const [confirm, setConfirm] = useState(null)
  const [formToko, setFormToko] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const fields = [
    { name: 'business_name', label: 'Nama toko', required: true },
    { name: 'business_category', label: 'Kategori', required: true },
    { name: 'address', label: 'Alamat', required: true },
    { name: 'operational_hours', label: 'Jam operasional', required: true },
    { name: 'owner_id', label: 'ID pemilik', required: true },
  ]

  const openForm = (toko = null) => {
    setFormToko(toko)
    setFormValues(
      toko
        ? { ...toko }
        : { business_name: '', business_category: '', address: '', operational_hours: '', owner_id: '' }
    )
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await saveToko(formToko?.id, formValues)
      setFormToko(null)
      setFormValues({})
    } catch (e) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const removeToko = async () => {
    try {
      await deleteToko(confirm.id)
    } catch (e) {
      alert(e.message)
    }
    setConfirm(null)
  }

  const pendingTokos = verifications.filter(
    (u) => u.role === 'toko' || (u.business_name && u.business_name.length > 0)
  )
  const pendingKurirs = verifications.filter(
    (u) => u.role === 'kurir' || (u.vehicle_type && u.vehicle_type.length > 0)
  )

  const handleVerify = async () => {
    if (!confirm?.user) return
    try {
      await verifyUser(confirm.user.id, confirm.status)
    } catch (e) {
      alert(e.message)
    }
    setConfirm(null)
  }

  const renderPending = (list, isKurir) => (
    <div style={{ background: 'white', border: '1px solid #E2E8E3', borderRadius: 18, overflow: 'hidden' }}>
      {list.length === 0 && (
        <p style={{ color: '#667085', textAlign: 'center', padding: 40 }}>Tidak ada antrean verifikasi.</p>
      )}
      {list.map((u) => (
        <div
          key={u.id}
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: isKurir ? '#EDE7F6' : '#F3E5F5',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {isKurir ? <Bike size={20} color="#4527A0" /> : <Building2 size={20} color="#7B1FA2" />}
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              {isKurir ? u.vehicle_type || 'Kurir' : u.business_name || u.full_name}
            </div>
            <div style={{ color: '#667085', fontSize: 12 }}>
              {u.full_name} • {u.email}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setConfirm({ user: u, status: 'approved' })}
              style={{
                border: 0,
                background: '#E8F5E9',
                color: '#2E7D32',
                padding: '8px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CheckCircle2 size={15} /> Setujui
            </button>
            <button
              onClick={() => setConfirm({ user: u, status: 'rejected' })}
              style={{
                border: 0,
                background: '#FFEBEE',
                color: '#D32F2F',
                padding: '8px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <XCircle size={15} /> Tolak
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Kelola Toko</h1>
          <p style={{ margin: '4px 0 0', color: '#667085' }}>
            {tokos.length} toko aktif • {verifications.length} antrean verifikasi
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => openForm()}
            style={{
              border: 0,
              background: '#2E7D32',
              color: 'white',
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={15} /> Tambah Toko
          </button>
          <button
            onClick={refresh}
            style={{
              border: '1px solid #D0D5DD',
              background: 'white',
              padding: '10px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      <h2
        style={{
          fontSize: 16,
          fontWeight: 900,
          margin: '0 0 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <Store size={18} color="#2E7D32" /> Toko Mitra Aktif
      </h2>
      <div
        style={{
          background: 'white',
          border: '1px solid #E2E8E3',
          borderRadius: 18,
          overflow: 'hidden',
          marginBottom: 28,
        }}
      >
        {loading && <p style={{ textAlign: 'center', padding: 40, color: '#667085' }}>Loading...</p>}
        {!loading && tokos.length === 0 && (
          <p style={{ color: '#667085', textAlign: 'center', padding: 40 }}>
            Belum ada toko terverifikasi.
          </p>
        )}
        {!loading &&
          tokos.map((t) => (
            <div
              key={t.id}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: '#E8F5E9',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Store size={20} color="#2E7D32" />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>
                  {t.business_name}{' '}
                  {t.average_rating > 0 && (
                    <span
                      style={{
                        color: '#FFB300',
                        display: 'inline-flex',
                        gap: 3,
                        alignItems: 'center',
                        fontSize: 12,
                      }}
                    >
                      <Star size={12} /> {Number(t.average_rating).toFixed(1)}
                    </span>
                  )}
                </div>
                <div style={{ color: '#667085', fontSize: 12 }}>
                  {t.business_category || '—'} • {t.address || '—'}
                </div>
              </div>
              <div
                style={{
                  color: '#1976D2',
                  background: '#E3F2FD',
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {t.operational_hours || '—'}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => openForm(t)}
                  title="Edit toko"
                  style={{
                    border: 0,
                    background: '#E3F2FD',
                    color: '#1565C0',
                    padding: 8,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setConfirm(t)}
                  title="Hapus toko"
                  style={{
                    border: 0,
                    background: '#FFEBEE',
                    color: '#D32F2F',
                    padding: 8,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 900, margin: '0 0 12px', color: '#E65100' }}>
        Verifikasi Toko — Menunggu ({pendingTokos.length})
      </h2>
      {renderPending(pendingTokos, false)}

      <h2 style={{ fontSize: 16, fontWeight: 900, margin: '24px 0 12px', color: '#4527A0' }}>
        Verifikasi Kurir — Menunggu ({pendingKurirs.length})
      </h2>
      {renderPending(pendingKurirs, true)}

      {/* Dialog Verifikasi (approve/reject) */}
      <ConfirmDialog
        open={Boolean(confirm?.user)}
        title={confirm?.status === 'approved' ? 'Setujui Verifikasi?' : 'Tolak Verifikasi?'}
        message={
          confirm?.user
            ? `${confirm.user.full_name || 'User'} (${confirm.user.email || '-'}) akan ${
                confirm.status === 'approved' ? 'disetujui dan diaktifkan' : 'ditolak'
              }.`
            : ''
        }
        danger={confirm?.status === 'rejected'}
        onConfirm={handleVerify}
        onCancel={() => setConfirm(null)}
      />

      {/* Dialog Hapus Toko */}
      <ConfirmDialog
        open={Boolean(confirm && !confirm.user)}
        title="Hapus Toko?"
        message={confirm ? `${confirm.business_name} akan dihapus permanen.` : ''}
        danger
        onConfirm={removeToko}
        onCancel={() => setConfirm(null)}
      />

      {/* Dialog Form Toko */}
      <AdminFormDialog
        open={Boolean(formToko) || Object.keys(formValues).length > 0}
        title={formToko ? 'Edit Toko' : 'Tambah Toko'}
        fields={fields}
        values={formValues}
        onChange={(name, value) => setFormValues((prev) => ({ ...prev, [name]: value }))}
        onSubmit={submitForm}
        onCancel={() => {
          setFormToko(null)
          setFormValues({})
        }}
        submitting={submitting}
      />
    </div>
  )
}