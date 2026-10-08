import { Link } from 'react-router-dom'
import { urlFor } from '../../lib/sanityClient'
import { swatch } from '../../lib/palette'
import { RESOURCE_CYCLE, categoryLabel } from '../../lib/resources'
import './ResourceCard.css'

/**
 * Colour-block resource card. Whole card links to /resources/{slug}.
 * Colour from resource.cardColour, else rotates blue → gold → coral → black.
 */
export default function ResourceCard({ resource, index = 0 }) {
  const sw = swatch(resource.cardColour || RESOURCE_CYCLE[index % RESOURCE_CYCLE.length])
  const meta = [
    resource.downloadCount > 0 && `${resource.downloadCount} download${resource.downloadCount > 1 ? 's' : ''}`,
    resource.linkCount > 0 && `${resource.linkCount} link${resource.linkCount > 1 ? 's' : ''}`,
    resource.hasVideo && 'Video',
  ].filter(Boolean)

  return (
    <Link
      to={`/resources/${resource.slug?.current}`}
      className={`resource-card ${sw.isLight ? 'is-light' : ''}`}
      style={{ '--rc-bg': sw.bg, '--rc-text': sw.text, '--rc-heading': sw.heading }}
    >
      {resource.coverImage && (
        <div className="rc-media">
          <img src={urlFor(resource.coverImage).width(800).height(450).url()} alt="" loading="lazy" />
        </div>
      )}
      <div className="rc-body">
        <div className="rc-tags">
          <span className="rc-tag">{categoryLabel(resource.category)}</span>
          {resource.featured && <span className="rc-tag is-outline">Featured</span>}
        </div>
        <h3 className="rc-title">{resource.title}</h3>
        {resource.summary && <p className="rc-summary">{resource.summary}</p>}
        <div className="rc-foot">
          {meta.length > 0 && <span className="rc-meta">{meta.join(' · ')}</span>}
          <span className="rc-more">Open <b aria-hidden="true">→</b></span>
        </div>
      </div>
    </Link>
  )
}
