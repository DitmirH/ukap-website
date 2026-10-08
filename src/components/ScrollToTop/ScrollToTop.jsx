import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Start every new page at the top.
 * - Back/forward (POP) keeps the browser's own scroll restoration.
 * - Links with a #hash (e.g. /#contact) are left to the page, which scrolls to that section.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()

  useLayoutEffect(() => {
    if (navType === 'POP' || hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash, navType])

  return null
}
