import { ColourSwatchInput } from '../components/ColourSwatchInput'
import { PALETTE } from '../lib/palette'

/** Reusable brand-colour field (15 swatches). Usage: colourField('cardColour', 'Card colour', 'help text') */
export const colourField = (name, title, description) => ({
  name,
  title,
  type: 'string',
  description,
  options: { list: PALETTE.map((p) => ({ title: p.label, value: p.key })) },
  components: { input: ColourSwatchInput },
})
