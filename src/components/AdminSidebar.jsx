import {
  LayoutDashboard, Users, Store, Package, Receipt,
  TrendingUp, Download, Shield, Settings,
} from 'lucide-react'

const items = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users, label: 'Pengguna' },
  { icon: Store, label: 'Toko' },
  { icon: Package, label: 'Produk' },
  { icon: Receipt, label: 'Pesanan' },
  { icon: TrendingUp, label: 'Analytics' },
  { icon: Download, label: 'Laporan' },
  { icon: Shield, label: 'Audit Logs' },
  { icon: Settings, label: 'Pengaturan' },
]

export default function AdminSidebar({ selectedIndex, onSelect }) {
  return (
    <aside style={{
      width: 260, background: '#0F172A', color: 'white',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: '#2E7D32',
          display: 'grid', placeItems: 'center', fontSize: 20,
        }}>🌱</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17 }}>FoodRescue</div>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>Admin Panel</div>
        </div>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,.08)' }} />
      <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {items.map((item, i) => {
          const Icon = item.icon
          const selected = i === selectedIndex
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                width: '100%', padding: '12px 14px', marginBottom: 3,
                borderRadius: 10,
                background: selected ? 'rgba(46,125,50,.18)' : 'transparent',
                border: selected ? '1px solid rgba(46,125,50,.4)' : '1px solid transparent',
                color: selected ? 'white' : 'rgba(255,255,255,.7)',
                fontWeight: selected ? 800 : 500,
                fontSize: 14, textAlign: 'left', cursor: 'pointer',
              }}
            >
              <Icon size={20} color={selected ? '#4CAF50' : 'rgba(255,255,255,.6)'} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}