import { useCallback, useEffect, useState } from 'react'
import { Settings as SettingsIcon, User, ShieldCheck, Server, LogOut, Globe, RefreshCw } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { adminApi } from '../api'

export default function SettingsPage() {
  const { admin, logout } = useAdmin()
  const [status, setStatus] = useState('checking')
  const [checkedAt, setCheckedAt] = useState(null)

  const checkConnection = useCallback(async () => {
    setStatus('checking')
    try {
      await adminApi.health()
      setStatus('online')
    } catch {
      setStatus('offline')
    }
    setCheckedAt(new Date())
  }, [])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const dotColor = status === 'online' ? '#4CAF50' : status === 'offline' ? '#F44336' : '#FFB300'
  const statusLabel = status === 'online' ? 'Terhubung' : status === 'offline' ? 'Tidak Terhubung' : 'Memeriksa...'

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Pengaturan</h1>
      <p style={{ margin: '4px 0 24px', color: '#667085' }}>
        Profil admin & status koneksi panel
      </p>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 24, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: '#2E7D32',
            color: 'white', display: 'grid', placeItems: 'center',
            fontWeight: 900, fontSize: 18,
          }}>
            {(admin?.full_name?.[0] || admin?.name?.[0] || 'A').toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 17 }}>{admin?.full_name || admin?.name || 'Admin'}</div>
            <div style={{ color: '#667085', fontSize: 13 }}>{admin?.email || '—'}</div>
          </div>
        </div>

        <div style={{
          display: 'grid', gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <User size={18} color="#2E7D32" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#667085', textTransform: 'uppercase' }}>
                Role
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>
                <span style={{
                  background: '#F3E5F5', color: '#7B1FA2',
                  padding: '3px 10px', borderRadius: 20, fontSize: 12,
                }}>
                  {admin?.role || 'admin'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Server size={18} color="#2E7D32" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#667085', textTransform: 'uppercase' }}>
                Status API
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 9, height: 9, borderRadius: 5, background: dotColor, display: 'inline-block',
                }} />
                {statusLabel}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Globe size={18} color="#2E7D32" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#667085', textTransform: 'uppercase' }}>
                API Base URL
              </div>
              <code style={{ fontSize: 12, wordBreak: 'break-all' }}>
                {import.meta.env.VITE_API_BASE_URL || 'belum diset'}
              </code>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={checkConnection}
            style={{
              border: '1px solid #D0D5DD', background: 'white',
              padding: '10px 16px', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <RefreshCw size={15} /> Tes Koneksi
          </button>
          {checkedAt && (
            <span style={{ color: '#94A3B8', fontSize: 12 }}>
              Terakhir dicek {checkedAt.toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E8E3',
        borderRadius: 18, padding: 24,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <ShieldCheck size={20} color="#2E7D32" />
          <div>
            <div style={{ fontWeight: 900, fontSize: 15 }}>Keamanan Sesi</div>
            <div style={{ color: '#667085', fontSize: 13 }}>
              Token tersimpan di sessionStorage; sesi berakhir otomatis saat 401.
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            border: 0, background: '#D32F2F', color: 'white',
            padding: '12px 20px', borderRadius: 10,
            fontSize: 14, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <LogOut size={16} /> Keluar dari Panel Admin
        </button>
      </div>

      <div style={{ marginTop: 20, color: '#94A3B8', fontSize: 12 }}>
        <SettingsIcon size={14} style={{ verticalAlign: -2 }} /> admin-web • Vite + React
      </div>
    </div>
  )
}
