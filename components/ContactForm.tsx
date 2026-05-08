'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('contactName') as HTMLInputElement).value,
      phone: (form.elements.namedItem('contactPhone') as HTMLInputElement).value,
      topic: (form.elements.namedItem('contactTopic') as HTMLSelectElement).value,
      message: (form.elements.namedItem('contactMessage') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        form.reset()
        window.location.href = '/thank-you/contact'
      } else {
        setErrorMsg(result.message)
        setStatus('error')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input type="text" name="contactName" className="form-input" placeholder="Your Name" required />
      </div>
      <div className="form-group">
        <input type="tel" name="contactPhone" className="form-input" placeholder="Phone Number" required />
      </div>
      <div className="form-group">
        <select name="contactTopic" className="form-select" defaultValue="">
          <option value="" disabled>Topic</option>
          <option>Boarding Inquiry</option>
          <option>Product Inquiry</option>
          <option>Grooming Appointment</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-group">
        <textarea name="contactMessage" className="form-input" rows={5} placeholder="Message" />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
      </button>
      {status === 'success' && (
        <p className="form-message success">Thanks for contacting us! We will get back to you soon.</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
