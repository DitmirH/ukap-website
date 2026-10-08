import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../../lib/sanityClient'
import './HeroCarousel.css'

// Campaign slide that always leads the carousel (Sanity slides follow it)
const BRAND_SLIDE = {
  _id: 'brand',
  title: 'Opening doors to education',
  subtitle:
    'Scholarships, mentoring and skills training that help young people build the futures they deserve.',
  imageUrl: '/images/hero-graduate.jpg',
  tone: 'black',
  primaryButton: { text: 'Support our work', link: '/donate' },
  secondaryButton: { text: 'About UKAP', link: '/about' },
}

const TONES = ['black', 'gold', 'coral']

const isExternal = (link) => /^https?:/.test(link || '')

function Cta({ button, variant }) {
  if (!button?.text || !button?.link) return null
  const cls = `hero-btn hero-btn-${variant}`
  return isExternal(button.link) ? (
    <a href={button.link} target="_blank" rel="noopener noreferrer" className={cls}>{button.text}</a>
  ) : (
    <Link to={button.link} className={cls}>{button.text}</Link>
  )
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState([BRAND_SLIDE])
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "heroSlide" && active == true] | order(order asc) {
          _id, title, subtitle, backgroundType, backgroundColor, customColor,
          image, duration, primaryButton, secondaryButton
        }`
      )
      .then((data) => {
        const cms = (data || []).map((s, i) => ({
          ...s,
          imageUrl: s.image ? urlFor(s.image).width(2000).height(1100).url() : null,
          tone: TONES[(i + 1) % TONES.length],
        }))
        setSlides([BRAND_SLIDE, ...cms])
      })
      .catch((err) => console.error(err))
  }, [])

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length])
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setTimeout(next, (slides[current]?.duration || 7) * 1000)
    return () => clearTimeout(timerRef.current)
  }, [slides, current, next])

  const slide = slides[current]

  return (
    <section className="hero">
      <div className="hero-row">
        <div className="hero-media">
          {slides.map((s, i) => (
            <div
              key={s._id}
              className={`hero-slide ${i === current ? 'active' : ''}`}
              style={s.imageUrl ? { backgroundImage: `url(${s.imageUrl})` } : undefined}
            />
          ))}
        </div>
      </div>

      <div className="hero-wrap">
        <div className={`hero-card tone-${slide.tone}`} key={slide._id}>
          <h1 className="hero-title">{slide.title}</h1>
          {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
          <div className="hero-buttons">
            <Cta button={slide.primaryButton} variant="primary" />
            <Cta button={slide.secondaryButton} variant="ghost" />
          </div>

          {slides.length > 1 && (
            <div className="hero-controls">
              <button className="hero-nav" onClick={prev} aria-label="Previous slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <div className="hero-dots">
                {slides.map((s, i) => (
                  <button
                    key={s._id}
                    className={`hero-dot ${i === current ? 'active' : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button className="hero-nav" onClick={next} aria-label="Next slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
