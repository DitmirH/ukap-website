import { Link } from 'react-router-dom'
import './FeatureBanner.css'

/** Wide photo with a solid colour card hanging off its bottom-right corner. */
export default function FeatureBanner({ image, imagePosition = 'center', eyebrow, title, text, cta, to, tone = 'red', align = 'right' }) {
  const isExternal = /^https?:/.test(to || '')
  const Btn = isExternal ? 'a' : Link
  const btnProps = isExternal ? { href: to, target: '_blank', rel: 'noopener noreferrer' } : { to }

  return (
    <section className={`feature-banner align-${align}`}>
      <div className="container">
        <div className="fb-frame">
          <div className="fb-media">
            <img src={image} alt="" loading="lazy" style={{ objectPosition: imagePosition }} />
          </div>
          <div className={`fb-card tone-${tone}`}>
            {eyebrow && <span className="fb-eyebrow">{eyebrow}</span>}
            <h2 className="fb-title">{title}</h2>
            {text && <p className="fb-text">{text}</p>}
            {cta && to && (
              <Btn {...btnProps} className="fb-btn">
                {cta}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
              </Btn>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
