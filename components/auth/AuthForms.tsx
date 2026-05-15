'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

function useStatus() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  return { loading, setLoading, message, setMessage, error, setError }
}

export function LoginForm() {
  const state = useStatus()
  async function submit(formData: FormData) {
    state.setLoading(true); state.setError('')
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }) })
    const result = await res.json()
    if (result.success) window.location.href = '/account'
    else { state.setError(result.message || 'Login failed.'); state.setLoading(false) }
  }
  function google() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) { state.setError('Google login is not configured yet.'); return }
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`
  }
  return <form action={submit} className="admin-form auth-card">
    <h1>Login to Way2Pets</h1>
    <label>Email</label><input name="email" type="email" className="form-input" required />
    <label>Password</label><input name="password" type="password" className="form-input" required />
    <button className="btn btn-primary" disabled={state.loading}>{state.loading ? 'Logging in...' : 'Login'}</button>
    <button type="button" className="btn btn-outline" onClick={google}>Continue with Google</button>
    <p><Link href="/forgot-password">Forgot password?</Link> · <Link href="/signup">Create account</Link></p>
    {state.error && <p className="form-message error">{state.error}</p>}
  </form>
}

export function SignupForm() {
  const state = useStatus()
  async function submit(formData: FormData) {
    state.setLoading(true); state.setError('')
    const payload = Object.fromEntries(formData.entries())
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const result = await res.json()
    if (result.success && !result.needsEmailConfirmation) window.location.href = '/account'
    else if (result.success) { state.setMessage('Account created. Please confirm your email, then log in.'); state.setLoading(false) }
    else { state.setError(result.message || 'Signup failed.'); state.setLoading(false) }
  }
  return <form action={submit} className="admin-form auth-card">
    <h1>Create Way2Pets Account</h1>
    <label>Full name</label><input name="fullName" className="form-input" required />
    <label>Email</label><input name="email" type="email" className="form-input" required />
    <label>Mobile</label><input name="mobile" type="tel" className="form-input" required />
    <label>WhatsApp (optional)</label><input name="whatsapp" type="tel" className="form-input" />
    <label>City</label><input name="city" className="form-input" />
    <label>Password</label><input name="password" type="password" minLength={8} className="form-input" required />
    <label>Confirm password</label><input name="confirmPassword" type="password" minLength={8} className="form-input" required />
    <button className="btn btn-primary" disabled={state.loading}>{state.loading ? 'Creating...' : 'Create account'}</button>
    <p>Already registered? <Link href="/login">Login</Link></p>
    {state.message && <p className="form-message success">{state.message}</p>}{state.error && <p className="form-message error">{state.error}</p>}
  </form>
}

export function ForgotPasswordForm() {
  const state = useStatus()
  async function submit(formData: FormData) {
    state.setLoading(true); state.setError('')
    const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.get('email') }) })
    const result = await res.json(); state.setLoading(false)
    if (result.success) state.setMessage(result.message)
    else state.setError(result.message)
  }
  return <form action={submit} className="admin-form auth-card"><h1>Forgot password</h1><label>Email</label><input name="email" type="email" className="form-input" required /><button className="btn btn-primary" disabled={state.loading}>Send reset link</button>{state.message && <p className="form-message success">{state.message}</p>}{state.error && <p className="form-message error">{state.error}</p>}</form>
}

export function ResetPasswordForm() {
  const state = useStatus()
  const [token] = useState(() => {
    if (typeof window === 'undefined') return ''
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return hash.get('access_token') || ''
  })
  async function submit(formData: FormData) {
    state.setLoading(true); state.setError('')
    const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: token, password: formData.get('password'), confirmPassword: formData.get('confirmPassword') }) })
    const result = await res.json()
    if (result.success) window.location.href = '/login?reset=1'
    else { state.setError(result.message); state.setLoading(false) }
  }
  return <form action={submit} className="admin-form auth-card"><h1>Reset password</h1>{!token && <p className="form-message error">Open this page from your Supabase reset email link.</p>}<label>New password</label><input name="password" type="password" minLength={8} className="form-input" required /><label>Confirm password</label><input name="confirmPassword" type="password" minLength={8} className="form-input" required /><button className="btn btn-primary" disabled={state.loading || !token}>Update password</button>{state.error && <p className="form-message error">{state.error}</p>}</form>
}

export function AuthCallback() {
  const [message, setMessage] = useState('Finishing login...')
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    const expires_in = Number(params.get('expires_in') || 3600)
    if (!access_token || !refresh_token) { queueMicrotask(() => setMessage('Login callback did not include a session. Check Supabase Google OAuth redirect settings.')); return }
    fetch('/api/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ access_token, refresh_token, expires_in, user: { id: '' } }) })
      .then((res) => res.json()).then((result) => { if (result.success) window.location.href = '/account'; else setMessage(result.message || 'Login failed.') })
      .catch(() => setMessage('Login failed.'))
  }, [])
  return <section className="section"><div className="container"><p>{message}</p></div></section>
}
