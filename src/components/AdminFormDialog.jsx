export default function AdminFormDialog({ open, title, fields, values, onChange, onSubmit, onCancel, submitting = false }) {
  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, .55)',
      display: 'grid', placeItems: 'center', zIndex: 1000, padding: 20,
    }}>
      <form onSubmit={onSubmit} style={{
        background: 'white', borderRadius: 18, padding: 24,
        width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 900 }}>{title}</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          {fields.map((field) => (
            <label key={field.name} style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#475467' }}>{field.label}</span>
              {field.type === 'select' ? (
                <select
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(event) => onChange(field.name, event.target.value)}
                  style={{ border: '1px solid #D0D5DD', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
                >
                  {!field.required && <option value="">Pilih...</option>}
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(event) => onChange(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  min={field.min}
                  step={field.step}
                  disabled={field.disabled}
                  style={{ border: '1px solid #D0D5DD', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
                />
              )}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
          <button type="button" onClick={onCancel} style={{
            border: '1px solid #D0D5DD', background: 'white', padding: '10px 18px',
            borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Batal</button>
          <button type="submit" disabled={submitting} style={{
            border: 0, background: '#2E7D32', color: 'white', padding: '10px 18px',
            borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer',
          }}>{submitting ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  )
}
