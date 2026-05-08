'use client'

import { useState } from 'react'

export default function AdminLoginForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(formData: FormData) {
    setStatus('loading')
    setMessage('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }),
    })

    const result = await res.json()
    if (result.success) {
      window.location.href = '/admin/dashboard'
      return
    }

    setMessage(result.message || 'Login failed.')
    setStatus('error')
  }

  return (
    <form action={submit} className="admin-form">
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" className="form-input" required />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" className="form-input" required />
      <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing in...' : 'Sign In'}
      </button>
      {status === 'error' && <p className="form-message error">{message}</p>}
    </form>
  )
}
