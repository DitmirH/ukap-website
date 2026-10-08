import { Link } from 'react-router-dom'
import { urlFor } from '../../lib/sanityClient'
import { swatch } from '../../lib/palette'
import './BlogCard.css'

// Colour bar / tag rotation for standard cards (brand accents)
const ACCENTS = ['blue', 'red', 'gold']
// Colour-block rotation for compact rows (palette keys, see src/lib/palette.js)
const ROW_COLOURS = ['blue-main', 'red-main', 'gold-main', 'black-lighter']

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null

/**
 * News card. The whole card links to /blog/{slug}.
 * - default:            photo, colour bar, tag + date, uppercase title, excerpt, "Read more →"
 * - variant="feature":  lead story — photo with a black panel overlapping its bottom edge
 * - variant="compact":  list row — small square photo, date, title (Home "Latest updates" side list)
 */
export default function BlogCard({ post, variant, index = 0 }) {
  const accent = ACCENTS[((index % ACCENTS.length) + ACCENTS.length) % ACCENTS.length]
  const href = `/blog/${post.slug?.current}`
  const date = fmtDate(post.publishedAt)
  const img = (w, h) => (post.mainImage ? urlFor(post.mainImage).width(w).height(h).url() : null)

  if (variant === 'compact') {
    return (
      <Link
        to={href}
        className="news-row"
        style={(() => {
          const sw = swatch(ROW_COLOURS[index % ROW_COLOURS.length])
          return { '--nr-bg': sw.bg, '--nr-text': sw.text }
        })()}
      >
        <div className="news-row-media">
          {img(240, 240) ? <img src={img(240, 240)} alt="" loading="lazy" /> : <span className="ukap-watermark" aria-hidden="true" />}
        </div>
        <div className="news-row-body">
          {date && <time dateTime={post.publishedAt}>{date}</time>}
          <h3 className="news-row-title">{post.title}</h3>
        </div>
        <b className="news-row-arrow" aria-hidden="true">→</b>
      </Link>
    )
  }

  if (variant === 'feature') {
    return (
      <Link to={href} className="news-feature">
        <div className="news-feature-media">
          {img(1200, 760) ? <img src={img(1200, 760)} alt="" loading="lazy" /> : <span className="ukap-watermark" aria-hidden="true" />}
          <span className="news-card-flag">Latest</span>
        </div>
        <div className="news-feature-panel">
          <div className="news-card-meta">
            <span className="news-card-tag">News</span>
            {date && <time dateTime={post.publishedAt}>{date}</time>}
          </div>
          <h3 className="news-feature-title">{post.title}</h3>
          {post.excerpt && <p className="news-feature-excerpt">{post.excerpt}</p>}
          <span className="news-card-more">Read the story <b aria-hidden="true">→</b></span>
        </div>
      </Link>
    )
  }

  return (
    <Link to={href} className={`news-card accent-${accent}`}>
      <div className="news-card-media">
        {img(700, 470) ? <img src={img(700, 470)} alt="" loading="lazy" /> : (
          <div className="news-card-noimg" aria-hidden="true"><span className="ukap-watermark" /></div>
        )}
      </div>
      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-card-tag">News</span>
          {date && <time dateTime={post.publishedAt}>{date}</time>}
        </div>
        <h3 className="news-card-title">{post.title}</h3>
        {post.excerpt && <p className="news-card-excerpt">{post.excerpt}</p>}
        <span className="news-card-more">Read more <b aria-hidden="true">→</b></span>
      </div>
    </Link>
  )
}
