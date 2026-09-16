export default function UserApp() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid', placeItems: 'center',
      background: 'linear-gradient(135deg, #F6FAF5 0%, #D9EBDC 100%)',
      fontFamily: 'system-ui, sans-serif',
      padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 48,
        maxWidth: 520, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(23,77,54,.1)',
      }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🍃</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px', color: '#174D36' }}>
          FoodRescue
        </h1>
        <p style={{ color: '#6D8176', marginBottom: 32, lineHeight: 1.6 }}>
          Aplikasi mobile FoodRescue menggunakan Flutter.
          Halaman ini khusus untuk <strong>Admin Panel</strong>.
        </p>
        <a
          href="/admin"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#174D36', color: 'white',
            padding: '14px 24px', borderRadius: 12,
            textDecoration: 'none', fontWeight: 700,
            fontSize: 15,
          }}
        >
          🔐 Buka Admin Panel
        </a>
      </div>
    </div>
  )
}