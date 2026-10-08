import { Link } from 'react-router-dom'
import { swatch } from '../../lib/palette'
import './PageHeader.css'

/**
 * Full-bleed colour-block page header (brand deck pattern).
 *
 * tone: 'blue' | 'red' | 'yellow' | 'ink'
 * crumbs: [{ label, to }] — rendered before the current page
 * image: optional URL shown as a square-cut panel on the right
 * children: optional actions (buttons) under the subtitle
 * colour: optional palette key (e.g. 'blue-main') — overrides tone with any of the 15 brand swatches
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  tone = 'blue',
  crumbs,
  image,
  imageAlt = '',
  size = 'default',
  photo,
  photoPosition = 'center',
  colour,
  children,
}) {
  const sw = colour ? swatch(colour) : null
  const onDark = sw ? !(sw.text === '#0B0B0C') : tone !== 'yellow'
  const colourStyle = sw ? { background: sw.bg, color: sw.text, '--ph-heading': sw.heading } : undefined

  // Photo variant: full-bleed image with a solid colour card overlapping its bottom edge
  if (photo) {
    return (
      <header className="page-header-photo">
        <div className="php-media" style={{ backgroundImage: `url(${photo})`, backgroundPosition: photoPosition }} />
        <div className="php-wrap">
          <div className={`php-card tone-${tone} ${sw ? 'has-colour' : ''}`} style={colourStyle}>
            {crumbs?.length > 0 && (
              <nav className="phb-crumbs" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                {crumbs.map((c) => (
                  <span key={c.label}>
                    <span className="phb-sep" aria-hidden="true">/</span>
                    {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
                  </span>
                ))}
              </nav>
            )}
            {eyebrow && <span className={`eyebrow ${onDark ? 'on-dark' : ''}`}>{eyebrow}</span>}
            <h1 className="php-title">{title}</h1>
            {subtitle && <p className="php-subtitle">{subtitle}</p>}
            {children && <div className="phb-actions">{children}</div>}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`page-header-block tone-${tone} size-${size} ${image ? 'has-image' : ''} ${sw ? 'has-colour' : ''}`} style={colourStyle}>
      <div className="phb-inner">
        <div className="phb-text">
          {crumbs?.length > 0 && (
            <nav className="phb-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              {crumbs.map((c) => (
                <span key={c.label}>
                  <span className="phb-sep" aria-hidden="true">/</span>
                  {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <span className={`eyebrow ${onDark ? 'on-dark' : ''}`}>{eyebrow}</span>}
          <h1 className="phb-title">{title}</h1>
          {subtitle && <p className="phb-subtitle">{subtitle}</p>}
          {children && <div className="phb-actions">{children}</div>}
        </div>

        {image ? (
          <div className="phb-image">
            <img src={image} alt={imageAlt} />
          </div>
        ) : (
          <span className="ukap-watermark phb-watermark" aria-hidden="true" />
        )}
      </div>

      <div className="tri-bar" aria-hidden="true"><span /><span /><span /></div>
    </header>
  )
}
