export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
      display: 'grid', placeItems: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: 'white', borderRadius: 18, padding: 24,
        width: '100%', maxWidth: 420,
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 900 }}>
          {danger && '⚠️ '}{title}
        </h3>
        <p style={{ color: '#667085', margin: '0 0 24px', fontSize: 14 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            border: '1px solid #D0D5DD', background: 'white',
            padding: '10px 18px', borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Batal</button>
          <button onClick={onConfirm} style={{
            border: 0,
            background: danger ? '#D32F2F' : '#2E7D32',
            color: 'white', padding: '10px 18px', borderRadius: 8,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Konfirmasi</button>
        </div>
      </div>
    </div>
  )
}