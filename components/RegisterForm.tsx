'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/src/i18n'

export default function RegisterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { t } = useI18n()

  useEffect(() => {
    fetch('/api/account/me')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        const profile = data?.profile
        if (!profile) return
        const form = document.querySelector('form[data-way2pets-form=register]') as HTMLFormElement | null
        if (!form) return
        ;(form.elements.namedItem('ownerName') as HTMLInputElement | null)?.setAttribute('value', String(profile.full_name || ''))
        ;(form.elements.namedItem('phone') as HTMLInputElement | null)?.setAttribute('value', String(profile.mobile || ''))
        ;(form.elements.namedItem('email') as HTMLInputElement | null)?.setAttribute('value', String(profile.email || ''))
        ;(form.elements.namedItem('address') as HTMLTextAreaElement | null)!.value = String(profile.address || profile.city || '')
      })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = {
      ownerName: (form.elements.namedItem('ownerName') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLTextAreaElement).value,
      petName: (form.elements.namedItem('petName') as HTMLInputElement).value,
      petType: (form.elements.namedItem('petType') as HTMLSelectElement).value,
      breed: (form.elements.namedItem('breed') as HTMLInputElement).value,
      dob: (form.elements.namedItem('dob') as HTMLInputElement).value,
      medical: (form.elements.namedItem('medical') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        form.reset()
        window.location.href = '/thank-you/register-pet'
      } else {
        setErrorMsg(result.message)
        setStatus('error')
      }
    } catch {
      setErrorMsg(t.registerForm.genericError)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} data-way2pets-form="register">
      <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)', borderBottom: '2px solid var(--accent-orange)', display: 'inline-block' }}>
        {t.registerForm.ownerDetails}
      </h3>
      <div className="form-group">
        <label htmlFor="ownerName">{t.registerForm.ownerName}</label>
        <input type="text" id="ownerName" name="ownerName" className="form-input" placeholder={t.registerForm.fullName} required />
      </div>
      <div className="form-group">
        <label htmlFor="phone">{t.registerForm.phone}</label>
        <input type="tel" id="phone" name="phone" className="form-input" placeholder={t.registerForm.contactNumber} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">{t.registerForm.email}</label>
        <input type="email" id="email" name="email" className="form-input" placeholder={t.registerForm.emailPlaceholder} required />
      </div>
      <div className="form-group">
        <label htmlFor="address">{t.registerForm.address}</label>
        <textarea id="address" name="address" className="form-input" rows={2} placeholder={t.registerForm.addressPlaceholder} />
      </div>

      <h3 style={{ margin: '30px 0 20px', color: 'var(--primary-green)', borderBottom: '2px solid var(--accent-orange)', display: 'inline-block' }}>
        {t.registerForm.petDetails}
      </h3>
      <div className="form-group">
        <label htmlFor="petName">{t.registerForm.petName}</label>
        <input type="text" id="petName" name="petName" className="form-input" placeholder={t.registerForm.petName} required />
      </div>
      <div className="form-group">
        <label htmlFor="petType">{t.registerForm.petType}</label>
        <select id="petType" name="petType" className="form-select">
          <option value="dog">{t.registerForm.dog}</option>
          <option value="cat">{t.registerForm.cat}</option>
          <option value="bird">{t.registerForm.bird}</option>
          <option value="other">{t.registerForm.other}</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="breed">{t.registerForm.breed}</label>
        <input type="text" id="breed" name="breed" className="form-input" placeholder={t.registerForm.breedPlaceholder} />
      </div>
      <div className="form-group">
        <label htmlFor="dob">{t.registerForm.dob}</label>
        <input type="text" id="dob" name="dob" className="form-input" placeholder={t.registerForm.dobPlaceholder} />
      </div>
      <div className="form-group">
        <label htmlFor="medical">{t.registerForm.medical}</label>
        <textarea id="medical" name="medical" className="form-input" rows={3} placeholder={t.registerForm.medicalPlaceholder} />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={status === 'loading'}>
        {status === 'loading' ? t.registerForm.registering : t.registerForm.submit}
      </button>
      {status === 'success' && (
        <p className="form-message success">Your request has been submitted. Create/login to your Way2Pets account with the same email to view and manage your request.</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
