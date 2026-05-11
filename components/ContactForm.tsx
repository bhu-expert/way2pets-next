'use client'

import { useState } from 'react'
import { useI18n } from '@/src/i18n'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { t } = useI18n()

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
      setErrorMsg(t.contactForm.genericError)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input type="text" name="contactName" className="form-input" placeholder={t.contactForm.name} required />
      </div>
      <div className="form-group">
        <input type="tel" name="contactPhone" className="form-input" placeholder={t.contactForm.phone} required />
      </div>
      <div className="form-group">
        <select name="contactTopic" className="form-select" defaultValue="">
          <option value="" disabled>{t.contactForm.topic}</option>
          <option>{t.contactForm.topics.boarding}</option>
          <option>{t.contactForm.topics.product}</option>
          <option>{t.contactForm.topics.grooming}</option>
          <option>{t.contactForm.topics.other}</option>
        </select>
      </div>
      <div className="form-group">
        <textarea name="contactMessage" className="form-input" rows={5} placeholder={t.contactForm.message} />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
        {status === 'loading' ? t.contactForm.sending : t.contactForm.submit}
      </button>
      {status === 'success' && (
        <p className="form-message success">{t.contactForm.success}</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
