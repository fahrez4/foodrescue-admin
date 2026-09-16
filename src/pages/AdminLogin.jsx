import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Mail, Lock, ArrowRight, Shield, BarChart3, Users as UsersIcon, FileText } from 'lucide-react'

export default function AdminLogin() {
  const { login } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await login(email, password)
    } catch (err) {
      setMessage(err.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: BarChart3, text: 'Real-time Analytics' },
    { icon: Shield, text: 'Keamanan Berlapis' },
    { icon: UsersIcon, text: 'Full Control Users & Stores' },
    { icon: FileText, text: 'Laporan & Export Lengkap' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #0F172A 100%)',
        display: 'grid', placeItems: 'center', color: 'white', padding: 40,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 90, marginBottom: 20 }}>🌱</div>
          <h1 style={{ fontSize: 44, fontWeight: 900, margin: '0 0 8px', letterSpacing: 1.5 }}>
            FoodRescue
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', letterSpacing: 4, fontSize: 14, margin: 0 }}>
            ADMIN CONTROL CENTER
          </p>
          <div style={{ marginTop: 50, textAlign: 'left' }}>
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.text} style={{ display: 'flex', gap: 12, padding: '8px 0', alignItems: 'center' }}>
                  <Icon size={22} color="rgba(255,255,255,.7)" />
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{f.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', display: 'grid', placeItems: 'center', padding: 40 }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: '#2E7D32', color: 'white',
            display: 'grid', placeItems: 'center',
            marginBottom: 24,
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 6px' }}>
            Selamat Datang, Admin
          </h2>
          <p style={{ color: '#667085', margin: '0 0 32px' }}>
            Masuk untuk mengelola platform FoodRescue
          </p>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1px solid #D0D5DD', borderRadius: 10,
              padding: '0 14px', height: 48,
            }}>
              <Mail size={18} color="#667085" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Admin"
                required
                style={{
                  flex: 1, border: 0, outline: 0,
                  fontSize: 14, padding: '0 10px', background: 'transparent',
                }}
              />
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1px solid #D0D5DD', borderRadius: 10,
              padding: '0 14px', height: 48,
            }}>
              <Lock size={18} color="#667085" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{
                  flex: 1, border: 0, outline: 0,
                  fontSize: 14, padding: '0 10px', background: 'transparent',
                }}
              />
            </div>
          </label>

          {message && (
            <div style={{
              background: '#FEE', color: '#B42318',
              padding: 12, borderRadius: 8, fontSize: 13,
              marginBottom: 16,
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', height: 50, border: 0,
              background: loading ? '#94A3B8' : '#2E7D32',
              color: 'white', borderRadius: 10,
              fontWeight: 800, fontSize: 14, letterSpacing: 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? 'Memeriksa...' : (
              <>MASUK SEBAGAI ADMIN <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}