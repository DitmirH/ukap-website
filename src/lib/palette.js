/**
 * UKAP brand palette — 15 swatches (keys stored in Sanity).
 * Keep in sync with studio/lib/palette.js.
 */
export const PALETTE = {
  'blue-main': '#3F7EC2', 'blue-lighter': '#55ADFA', 'blue-softest': '#CCE9FC',
  'red-main': '#DB4A47', 'red-lighter': '#E06E71', 'red-softest': '#F3C9CB',
  'gold-main': '#E2BE74', 'gold-lighter': '#F8DCA0', 'gold-softest': '#FCF0D7',
  'black-main': '#0B0B0C', 'black-lighter': '#3A3B3F', 'black-softest': '#6B6E75',
  'white-main': '#FFFFFF', 'white-lighter': '#F5F3EE', 'white-softest': '#EDEAE3',
}

/** Default rotation when no colour is chosen. */
export const DEFAULT_CYCLE = ['red-main', 'black-main', 'gold-main']

const luminance = (hex) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

/**
 * Resolve a palette key into the colours a component needs.
 * Returns { key, bg, text, heading, isDark, isLight }.
 */
export function swatch(key, fallbackIndex = 0) {
  const k = PALETTE[key] ? key : DEFAULT_CYCLE[fallbackIndex % DEFAULT_CYCLE.length]
  const bg = PALETTE[k]
  const L = luminance(bg)
  const darkText = (L + 0.05) / 0.05 > 1.05 / (L + 0.05)
  const isDark = !darkText
  return {
    key: k,
    bg,
    text: darkText ? '#0B0B0C' : '#FFFFFF',
    // Gold headings on the deepest blacks (brand pattern)
    heading: k === 'black-main' || k === 'black-lighter' ? '#E2BE74' : darkText ? '#0B0B0C' : '#FFFFFF',
    isDark,
    isLight: k.startsWith('white'),
  }
}
