import { Link } from 'react-router-dom'
import './PageHeader.css'

/**
 * Full-bleed colour-block page header (brand deck pattern).
 *
 * tone: 'blue' | 'red' | 'yellow' | 'ink'
 * crumbs: [{ label, to }] — rendered before the current page
 * image: optional URL shown as a square-cut panel on the right
 * children: optional actions (buttons) under the subtitle
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
  children,
}) {
  const onDark = tone !== 'yellow'

  // Photo variant: full-bleed image with a solid colour card overlapping its bottom edge
  if (photo) {
    return (
      <header className="page-header-photo">
        <div className="php-media" style={{ backgroundImage: `url(${photo})`, backgroundPosition: photoPosition }} />
        <div className="php-wrap">
          <div className={`php-card tone-${tone}`}>
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
    <header className={`page-header-block tone-${tone} size-${size} ${image ? 'has-image' : ''}`}>
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
