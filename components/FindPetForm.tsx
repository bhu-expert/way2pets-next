'use client'

import { useState } from 'react'

export default function FindPetForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = {
      petType: (form.elements.namedItem('findPetType') as HTMLSelectElement).value,
      preferredSize: (form.elements.namedItem('findPetSize') as HTMLSelectElement).value,
      contact: (form.elements.namedItem('findPetContact') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/find-pet', {
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
        <label>I am looking for a:</label>
        <select name="findPetType" className="form-select">
          <option>Puppy</option>
          <option>Adult Dog</option>
          <option>Kitten</option>
          <option>Cat</option>
        </select>
      </div>
      <div className="form-group">
        <label>Preferred Size/Breed:</label>
        <select name="findPetSize" className="form-select">
          <option>Small (Apartment Friendly)</option>
          <option>Medium (Active)</option>
          <option>Large (Guard/Farm)</option>
          <option>Indie / Desi (High Immunity)</option>
        </select>
      </div>
      <div className="form-group">
        <label>Your Contact Number:</label>
        <input type="text" name="findPetContact" className="form-input" placeholder="+91 99999 99999" required />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Show Me Pets'}
      </button>
      {status === 'success' && (
        <p className="form-message success">Thanks! We will reach out to you with matching pets soon.</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
