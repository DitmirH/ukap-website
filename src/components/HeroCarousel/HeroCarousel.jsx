import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../../lib/sanityClient'
import './HeroCarousel.css'

export default function HeroCarousel() {
  const [slides, setSlides] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "heroSlide" && active == true] | order(order asc) {
          _id,
          title,
          subtitle,
          image,
          overlay,
          duration,
          textAlign,
          primaryButton,
          secondaryButton
        }`
      )
      .then((data) => {
        setSlides(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Auto-advance slides with per-slide duration
  useEffect(() => {
    if (slides.length <= 1) return
    
    const currentDuration = (slides[currentSlide]?.duration || 6) * 1000
    
    timerRef.current = setTimeout(nextSlide, currentDuration)
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [slides, currentSlide, nextSlide])

  const renderButton = (button, isPrimary = true) => {
    if (!button?.text || !button?.link) return null
    
    const isExternal = button.link.startsWith('http')
    const className = isPrimary ? 'hero-cta hero-cta-primary' : 'hero-cta hero-cta-secondary'
    
    if (isExternal) {
      return (
        <a 
          href={button.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className={className}
        >
          {button.text}
        </a>
      )
    }
    
    return (
      <Link to={button.link} className={className}>
        {button.text}
      </Link>
    )
  }

  if (loading) {
    return <div className="hero-carousel hero-carousel-loading" />
  }

  if (slides.length === 0) {
    return null
  }

  const slide = slides[currentSlide]

  return (
    <div className="hero-carousel">
      {slides.map((s, index) => (
        <div
          key={s._id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${urlFor(s.image).width(1920).height(1080).url()})`,
          }}
        >
          <div 
            className="hero-overlay" 
            style={{ opacity: (s.overlay ?? 50) / 100 }} 
          />
        </div>
      ))}

      <div className={`hero-content align-${slide.textAlign || 'center'}`}>
        <h1 className="hero-title">{slide.title}</h1>
        {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
        
        {(slide.primaryButton?.text || slide.secondaryButton?.text) && (
          <div className="hero-buttons">
            {renderButton(slide.primaryButton, true)}
            {renderButton(slide.secondaryButton, false)}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button className="hero-nav hero-nav-prev" onClick={prevSlide} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="hero-nav hero-nav-next" onClick={nextSlide} aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="hero-progress">
            <div 
              className="hero-progress-bar" 
              key={currentSlide}
              style={{ 
                animationDuration: `${slide.duration || 6}s` 
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
