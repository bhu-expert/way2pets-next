'use client'

import { useState } from 'react'

export default function RegisterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
      setErrorMsg('Something went wrong. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)', borderBottom: '2px solid var(--accent-orange)', display: 'inline-block' }}>
        Owner Details
      </h3>
      <div className="form-group">
        <label htmlFor="ownerName">Owner Name</label>
        <input type="text" id="ownerName" name="ownerName" className="form-input" placeholder="Your Full Name" required />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" className="form-input" placeholder="Contact Number" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" className="form-input" placeholder="Your Email" required />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea id="address" name="address" className="form-input" rows={2} placeholder="Your Address" />
      </div>

      <h3 style={{ margin: '30px 0 20px', color: 'var(--primary-green)', borderBottom: '2px solid var(--accent-orange)', display: 'inline-block' }}>
        Pet Details
      </h3>
      <div className="form-group">
        <label htmlFor="petName">Pet&apos;s Name</label>
        <input type="text" id="petName" name="petName" className="form-input" placeholder="Pet's Name" required />
      </div>
      <div className="form-group">
        <label htmlFor="petType">Pet Type</label>
        <select id="petType" name="petType" className="form-select">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="breed">Breed</label>
        <input type="text" id="breed" name="breed" className="form-input" placeholder="e.g. Labrador, Persian Cat" />
      </div>
      <div className="form-group">
        <label htmlFor="dob">Date of Birth / Age</label>
        <input type="text" id="dob" name="dob" className="form-input" placeholder="e.g. 2 years old" />
      </div>
      <div className="form-group">
        <label htmlFor="medical">Medical History / Allergies (if any)</label>
        <textarea id="medical" name="medical" className="form-input" rows={3} placeholder="Any specific needs or medical conditions?" />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Registering...' : 'Register Now'}
      </button>
      {status === 'success' && (
        <p className="form-message success">Registration successful! Please check your email for confirmation.</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
