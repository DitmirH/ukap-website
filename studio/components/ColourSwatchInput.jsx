import { useCallback } from 'react'
import { set, unset } from 'sanity'
import { PALETTE } from '../lib/palette'

const ROWS = ['blue', 'red', 'gold', 'black', 'white']
const COLS = ['main', 'lighter', 'softest']

// Pick black or white text for readability on a swatch
const textOn = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  return (L + 0.05) / 0.05 > 1.05 / (L + 0.05) ? '#0B0B0C' : '#FFFFFF'
}

/** 15-swatch brand colour picker. Stores the palette key as a string. */
export function ColourSwatchInput(props) {
  const { value, onChange, readOnly } = props

  const pick = useCallback(
    (key) => onChange(key === value ? unset() : set(key)),
    [onChange, value]
  )

  const cell = { width: 92, height: 52, borderRadius: 4, border: '1px solid rgba(0,0,0,0.12)', cursor: readOnly ? 'default' : 'pointer', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '5px 7px', fontSize: 10, fontWeight: 600 }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(3, 92px)', gap: 8, alignItems: 'center' }}>
        <span />
        {COLS.map((c) => (
          <span key={c} style={{ fontSize: 12, textAlign: 'center', opacity: 0.7, textTransform: 'capitalize' }}>{c}</span>
        ))}
        {ROWS.map((r) => [
          <span key={r} style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{r}</span>,
          ...COLS.map((c) => {
            const sw = PALETTE.find((p) => p.key === `${r}-${c}`)
            const selected = value === sw.key
            return (
              <button
                key={sw.key}
                type="button"
                title={sw.label}
                disabled={readOnly}
                onClick={() => pick(sw.key)}
                style={{
                  ...cell,
                  background: sw.hex,
                  color: textOn(sw.hex),
                  outline: selected ? '3px solid #2276fc' : 'none',
                  outlineOffset: 2,
                }}
              >
                {sw.hex}
                {selected && <span style={{ position: 'absolute', top: 4, right: 7, fontSize: 15 }}>✓</span>}
              </button>
            )
          }),
        ])}
      </div>
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
        {value ? `Selected: ${PALETTE.find((p) => p.key === value)?.label || value} — click again to clear` : 'Nothing selected — the default colour will be used.'}
      </div>
    </div>
  )
}
