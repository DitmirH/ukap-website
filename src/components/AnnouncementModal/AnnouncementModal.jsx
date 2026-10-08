import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../../lib/sanityClient'
import './AnnouncementModal.css'

// Storage key is tied to the document + its last edit, so republishing
// with new content shows the modal again even for "only once" visitors.
const storageKey = (a) => `ukap-announcement-${a._id}-${a._updatedAt}`

const alreadySeen = (a) => {
  const key = storageKey(a)
  switch (a.frequency) {
    case 'always':
      return false
    case 'session':
      return sessionStorage.getItem(key) === 'seen'
    case 'day': {
      const seenAt = localStorage.getItem(key)
      return seenAt && Date.now() - Number(seenAt) < 24 * 60 * 60 * 1000
    }
    case 'once':
      return Boolean(localStorage.getItem(key))
    default:
      return false
  }
}

const markSeen = (a) => {
  const key = storageKey(a)
  try {
    if (a.frequency === 'session') sessionStorage.setItem(key, 'seen')
    if (a.frequency === 'day' || a.frequency === 'once')
      localStorage.setItem(key, String(Date.now()))
  } catch (e) {
    // Storage unavailable (private mode etc.) — fail open, no persistence
  }
}

export default function AnnouncementModal() {
  const [announcement, setAnnouncement] = useState(null)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    let timer
    client
      .fetch(
        `*[_type == "announcementModal" && active == true][0] {
          _id, _updatedAt, title, body, image,
          ctaText, ctaLink, dismissText, frequency, delay
        }`
      )
      .then((data) => {
        if (!data || alreadySeen(data)) return
        setAnnouncement(data)
        timer = setTimeout(() => setVisible(true), (data.delay ?? 1) * 1000)
      })
      .catch((err) => console.error(err))
    return () => clearTimeout(timer)
  }, [])

  const close = useCallback(() => {
    if (announcement) markSeen(announcement)
    setClosing(true)
    setTimeout(() => setVisible(false), 250)
  }, [announcement])

  // Escape to close + focus the close button on open
  useEffect(() => {
    if (!visible) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    closeButtonRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, close])

  if (!visible || !announcement) return null

  const { title, body, image, ctaText, ctaLink, dismissText } = announcement
  const isExternal = ctaLink?.startsWith('http')

  return (
    <div
      className={`announcement-overlay ${closing ? 'closing' : ''}`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="announcement-modal" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeButtonRef}
          className="announcement-close"
          onClick={close}
          aria-label="Close announcement"
        >
          ×
        </button>

        {image && (
          <div className="announcement-image">
            <img
              src={urlFor(image).width(760).height(400).url()}
              alt={image.alt || ''}
            />
          </div>
        )}

        <div className="announcement-content">
          <h2 className="announcement-title">{title}</h2>
          {body && <p className="announcement-body">{body}</p>}

          <div className="announcement-actions">
            {ctaText && ctaLink && (
              isExternal ? (
                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  onClick={close}
                >
                  {ctaText}
                </a>
              ) : (
                <Link to={ctaLink} className="btn-primary" onClick={close}>
                  {ctaText}
                </Link>
              )
            )}
            <button className="announcement-dismiss" onClick={close}>
              {dismissText || 'No thanks'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
