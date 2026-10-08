/**
 * UKAP brand palette — 15 swatches (5 colours × Main / Lighter / Softest).
 * Keep in sync with src/lib/palette.js in the website.
 * Content stores the KEY (e.g. "gold-main"), never the hex.
 */
export const PALETTE = [
  { key: 'blue-main', label: 'Blue · Main', hex: '#3F7EC2' },
  { key: 'blue-lighter', label: 'Blue · Lighter', hex: '#55ADFA' },
  { key: 'blue-softest', label: 'Blue · Softest', hex: '#CCE9FC' },
  { key: 'red-main', label: 'Red · Main', hex: '#DB4A47' },
  { key: 'red-lighter', label: 'Red · Lighter', hex: '#E06E71' },
  { key: 'red-softest', label: 'Red · Softest', hex: '#F3C9CB' },
  { key: 'gold-main', label: 'Gold · Main', hex: '#E2BE74' },
  { key: 'gold-lighter', label: 'Gold · Lighter', hex: '#F8DCA0' },
  { key: 'gold-softest', label: 'Gold · Softest', hex: '#FCF0D7' },
  { key: 'black-main', label: 'Black · Main', hex: '#0B0B0C' },
  { key: 'black-lighter', label: 'Black · Lighter', hex: '#3A3B3F' },
  { key: 'black-softest', label: 'Black · Softest', hex: '#6B6E75' },
  { key: 'white-main', label: 'White · Main', hex: '#FFFFFF' },
  { key: 'white-lighter', label: 'White · Lighter', hex: '#F5F3EE' },
  { key: 'white-softest', label: 'White · Softest', hex: '#EDEAE3' },
]

export const PALETTE_KEYS = PALETTE.map((p) => p.key)
