'use client'

import { useState } from 'react'

export default function BoardingForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = {
      petName: (form.elements.namedItem('boardingPetName') as HTMLInputElement).value,
      checkIn: (form.elements.namedItem('boardingCheckIn') as HTMLInputElement).value,
      checkOut: (form.elements.namedItem('boardingCheckOut') as HTMLInputElement).value,
      foodPreference: (form.elements.namedItem('boardingFood') as HTMLSelectElement).value,
      medical: (form.elements.namedItem('boardingMedical') as HTMLTextAreaElement).value,
      contact: (form.elements.namedItem('boardingContact') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/boarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        form.reset()
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
        <label>Pet Name &amp; Breed</label>
        <input type="text" name="boardingPetName" className="form-input" placeholder="e.g. Bruno (Labrador)" required />
      </div>
      <div className="form-group">
        <label>Dates</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="date" name="boardingCheckIn" className="form-input" required />
          <input type="date" name="boardingCheckOut" className="form-input" required />
        </div>
      </div>
      <div className="form-group">
        <label>Food Preference</label>
        <select name="boardingFood" className="form-select">
          <option>Natural Food (Served by Us)</option>
          <option>Kibble (Provided by Owner)</option>
          <option>Special Diet</option>
        </select>
      </div>
      <div className="form-group">
        <label>Any Medical Issues?</label>
        <textarea name="boardingMedical" className="form-input" rows={2} />
      </div>
      <div className="form-group">
        <label>Your Contact</label>
        <input type="tel" name="boardingContact" className="form-input" placeholder="+91..." required />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Request Booking'}
      </button>
      {status === 'success' && (
        <p className="form-message success">Booking request sent! We will contact you soon to confirm.</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
