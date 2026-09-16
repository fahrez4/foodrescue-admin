export default function StatCard({ title, value, icon: Icon, color, change, subtitle }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #E2E8E3',
      borderRadius: 18,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}20`,
          display: 'grid', placeItems: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{ color: '#667085', fontSize: 12, fontWeight: 600 }}>{title}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color }}>{value}</div>
      {subtitle && <div style={{ fontSize: 11, color: '#94A3B8' }}>{subtitle}</div>}
      {change && (
        <div style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          background: change.startsWith('+') ? '#E8F5E9' : '#FFEBEE',
          color: change.startsWith('+') ? '#2E7D32' : '#D32F2F',
          fontSize: 10, fontWeight: 800,
          padding: '2px 8px', borderRadius: 20,
        }}>
          {change}
        </div>
      )}
    </div>
  )
}