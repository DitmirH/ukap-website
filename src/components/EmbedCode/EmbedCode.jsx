import { useEffect, useRef } from 'react'
import './EmbedCode.css'

export default function EmbedCode({ code, title }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !code) return

    // Clear previous content
    containerRef.current.innerHTML = ''

    // Create a temporary container to parse the HTML
    const temp = document.createElement('div')
    temp.innerHTML = code

    // Extract and handle scripts separately
    const scripts = temp.querySelectorAll('script')
    const scriptData = []

    scripts.forEach(script => {
      scriptData.push({
        src: script.src,
        content: script.innerHTML,
        attributes: Array.from(script.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value
          return acc
        }, {}),
      })
      script.remove()
    })

    // Insert the HTML (without scripts)
    containerRef.current.innerHTML = temp.innerHTML

    // Now load and execute scripts
    scriptData.forEach(({ src, content, attributes }) => {
      const newScript = document.createElement('script')
      
      // Copy all attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (key !== 'src') {
          newScript.setAttribute(key, value)
        }
      })

      if (src) {
        newScript.src = src
        newScript.async = true
      } else if (content) {
        newScript.innerHTML = content
      }

      containerRef.current.appendChild(newScript)
    })

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [code])

  if (!code) return null

  return (
    <div className="embed-code-wrapper" data-title={title}>
      <div ref={containerRef} className="embed-code-container" />
    </div>
  )
}

