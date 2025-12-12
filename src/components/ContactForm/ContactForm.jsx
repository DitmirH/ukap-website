import { useState } from 'react'
import './ContactForm.css'

export default function ContactForm() {
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (res.ok) {
        setStatus('success')
        e.target.reset()
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
      </div>
      <input type="tel" name="phone" placeholder="Phone Number" required />
      <input type="email" name="email" placeholder="Email" required />
      <textarea name="message" placeholder="Your message..." rows="4" required></textarea>
      <button type="submit" className="btn-send" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p className="status success">Message sent successfully!</p>}
      {status === 'error' && <p className="status error">Failed to send. Please try again.</p>}
    </form>
  )
}

