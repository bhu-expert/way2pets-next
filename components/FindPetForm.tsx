'use client'

import { useState } from 'react'
import { useI18n } from '@/src/i18n'

export default function FindPetForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { t } = useI18n()

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
      setErrorMsg(t.findPetForm.genericError)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t.findPetForm.lookingFor}</label>
        <select name="findPetType" className="form-select">
          <option>{t.findPetForm.puppy}</option>
          <option>{t.findPetForm.adultDog}</option>
          <option>{t.findPetForm.kitten}</option>
          <option>{t.findPetForm.cat}</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t.findPetForm.size}</label>
        <select name="findPetSize" className="form-select">
          <option>{t.findPetForm.small}</option>
          <option>{t.findPetForm.medium}</option>
          <option>{t.findPetForm.large}</option>
          <option>{t.findPetForm.indie}</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t.findPetForm.contact}</label>
        <input type="text" name="findPetContact" className="form-input" placeholder="+91 99999 99999" required />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
        {status === 'loading' ? t.findPetForm.submitting : t.findPetForm.submit}
      </button>
      {status === 'success' && (
        <p className="form-message success">{t.findPetForm.success}</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
