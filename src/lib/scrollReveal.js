/* ============================================================
   Scroll-reveal engine
   Tags interesting elements with [data-reveal] and toggles
   .in-view via IntersectionObserver. A MutationObserver keeps
   watching so content that arrives async from Sanity is
   picked up automatically — no per-component wiring needed.
   ============================================================ */

const SELECTORS = [
  '.section-title',
  '.block-head',
  '.tile',
  '.cta-band-inner',
  '.page-title',
  '.events-title',
  '.event-item',
  '.programme-card',
  '.about-programme',
  '.mission-body',
  '.programmes-cta',
  '.blog-card',
  '.team-card',
  '.sponsor-card',
  '.tier-card',
  '.why-card',
  '.impact-stat',
  '.giftaid-note-box',
  '.contact-form-wrapper',
  '.event-info-card',
  '.blog-post-content',
  '.page-description',
  '.section-description',
  '.donate-intro',
  '.donate-note',
].join(',')

const STAGGER_MS = 70
const STAGGER_MAX = 6

export function initScrollReveal() {
  if (
    typeof window === 'undefined' ||
    !('IntersectionObserver' in window) ||
    !('MutationObserver' in window)
  ) {
    return
  }

  document.body.classList.add('reveal-ready')

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
  )

  const tag = () => {
    document.querySelectorAll(SELECTORS).forEach((el) => {
      if (el.hasAttribute('data-reveal')) return
      el.setAttribute('data-reveal', '')

      // Stagger siblings that reveal together (e.g. cards in a grid)
      const parent = el.parentElement
      if (parent) {
        const idx = Array.prototype.indexOf.call(
          parent.querySelectorAll(':scope > [data-reveal]'),
          el
        )
        if (idx > 0) {
          el.style.transitionDelay = `${Math.min(idx, STAGGER_MAX) * STAGGER_MS}ms`
        }
      }

      io.observe(el)
    })
  }

  tag()

  const root = document.getElementById('root') || document.body
  const mo = new MutationObserver(tag)
  mo.observe(root, { childList: true, subtree: true })
}
