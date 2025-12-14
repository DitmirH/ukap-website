import { useEffect, useRef } from 'react'
import './TicketTailorEmbed.css'

export default function TicketTailorEmbed({ 
  eventUrl = 'https://www.tickettailor.com/all-tickets/ukapfoundation/',
  showSearchFilter = true,
  showDateFilter = true,
  showSort = true,
  minimal = true,
  showLogo = false,
  bgFill = false,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    // Build the full URL with parameters
    const params = new URLSearchParams({
      ref: 'website_widget',
      show_search_filter: showSearchFilter,
      show_date_filter: showDateFilter,
      show_sort: showSort,
    })
    const fullUrl = `${eventUrl}?${params.toString()}`

    // Create the widget container
    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tt-widget'
    
    // Create fallback content
    const fallbackDiv = document.createElement('div')
    fallbackDiv.className = 'tt-widget-fallback'
    fallbackDiv.innerHTML = `
      <p>
        <a href="${fullUrl}" target="_blank">Click here to buy tickets</a>
        <br />
        <small><a href="https://www.tickettailor.com?rf=wdg_281394" class="tt-widget-powered">Sell tickets online with Ticket Tailor</a></small>
      </p>
    `
    widgetDiv.appendChild(fallbackDiv)

    // Create and append script
    const script = document.createElement('script')
    script.src = 'https://cdn.tickettailor.com/js/widgets/min/widget.js'
    script.setAttribute('data-url', fullUrl)
    script.setAttribute('data-type', 'inline')
    script.setAttribute('data-inline-minimal', minimal.toString())
    script.setAttribute('data-inline-show-logo', showLogo.toString())
    script.setAttribute('data-inline-bg-fill', bgFill.toString())
    script.setAttribute('data-inline-inherit-ref-from-url-param', '')
    script.setAttribute('data-inline-ref', 'website_widget')
    script.async = true

    widgetDiv.appendChild(script)

    // Append to container
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(widgetDiv)
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [eventUrl, showSearchFilter, showDateFilter, showSort, minimal, showLogo, bgFill])

  return (
    <div className="ticket-tailor-embed" ref={containerRef}>
      <div className="ticket-tailor-loading">Loading tickets...</div>
    </div>
  )
}

