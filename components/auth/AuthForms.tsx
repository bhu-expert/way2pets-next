'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import AuthCard from './AuthCard'

const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true'

function useStatus() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  return { loading, setLoading, message, setMessage, error, setError }
}

function PasswordField({
  name,
  label,
  autoComplete,
}: {
  name: string
  label: string
  autoComplete: string
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="auth-field">
      <label htmlFor={name}>{label}</label>
      <div className="password-input-wrap">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          minLength={8}
          className="form-input"
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}

function AuthLinks({ children }: { children: ReactNode }) {
  return <div className="auth-links">{children}</div>
}

function friendlyGoogleError(value: string | null) {
  const normalized = value?.toLowerCase() || ''
  if (normalized.includes('unsupported provider') || normalized.includes('provider is not enabled')) {
    return 'Google login is not enabled yet. Please use email and password.'
  }
  return 'Google login could not be completed. Please use email and password or try again later.'
}

export function LoginForm() {
  const state = useStatus()

  const { setMessage, setError } = state

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('reset') === '1') {
      setMessage('Your password has been updated. Please log in with your new password.')
    }
    const googleError = params.get('error_description') || params.get('error')
    if (googleError) setError(friendlyGoogleError(googleError))
  }, [setError, setMessage])

  async function submit(formData: FormData) {
    state.setLoading(true)
    state.setError('')
    state.setMessage('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }),
    })
    const result = await res.json()
    if (result.success) window.location.href = '/account'
    else {
      state.setError(result.message || 'We could not log you in. Please check your email and password.')
      state.setLoading(false)
    }
  }

  function google() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!googleAuthEnabled) {
      state.setError('Google login will be available soon. Please use email and password.')
      return
    }
    if (!supabaseUrl || !anonKey) {
      state.setError('Google login is not configured yet. Please use email and password.')
      return
    }
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`
  }

  return (
    <AuthCard
      heading="Welcome back to Way2Pets"
      subtitle="Login to view your pet registrations, boarding bookings and saved pet details."
    >
      <form action={submit} className="admin-form auth-form" noValidate={false}>
        {state.message && <p className="form-message success">{state.message}</p>}
        {state.error && <p className="form-message error">{state.error}</p>}
        <div className="auth-field">
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" name="email" type="email" className="form-input" autoComplete="email" required />
        </div>
        <PasswordField name="password" label="Password" autoComplete="current-password" />
        <button className="btn btn-primary auth-submit" disabled={state.loading}>
          {state.loading ? 'Logging in...' : 'Login'}
        </button>
        {googleAuthEnabled ? (
          <button type="button" className="btn btn-outline auth-submit" onClick={google} disabled={state.loading}>
            Continue with Google
          </button>
        ) : (
          <div className="auth-google-disabled" aria-live="polite">
            <button type="button" className="btn btn-outline auth-submit" disabled>
              Continue with Google
            </button>
            <small>Google login will be available soon.</small>
          </div>
        )}
        <AuthLinks>
          <Link href="/forgot-password">Forgot password?</Link>
          <Link href="/signup">Create account</Link>
          <Link href="/">Back to home</Link>
        </AuthLinks>
      </form>
    </AuthCard>
  )
}

export function SignupForm() {
  const state = useStatus()
  async function submit(formData: FormData) {
    state.setLoading(true)
    state.setError('')
    state.setMessage('')
    const payload = Object.fromEntries(formData.entries())
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    if (result.success && !result.needsEmailConfirmation) window.location.href = '/account'
    else if (result.success) {
      state.setMessage('Account created. Please confirm your email, then log in.')
      state.setLoading(false)
    } else {
      state.setError(result.message || 'We could not create your account. Please check the form and try again.')
      state.setLoading(false)
    }
  }

  return (
    <AuthCard
      heading="Create your Way2Pets account"
      subtitle="Register once and manage your pets, boarding requests and adoption/sale enquiries."
    >
      <form action={submit} className="admin-form auth-form" noValidate={false}>
        {state.message && <p className="form-message success">{state.message}</p>}
        {state.error && <p className="form-message error">{state.error}</p>}
        <div className="auth-field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" className="form-input" autoComplete="name" required />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" name="email" type="email" className="form-input" autoComplete="email" required />
        </div>
        <div className="auth-field">
          <label htmlFor="mobile">Mobile number</label>
          <input id="mobile" name="mobile" type="tel" className="form-input" autoComplete="tel" inputMode="tel" required />
        </div>
        <div className="auth-field">
          <label htmlFor="whatsapp">WhatsApp number <span>(optional)</span></label>
          <input id="whatsapp" name="whatsapp" type="tel" className="form-input" autoComplete="tel" inputMode="tel" />
        </div>
        <div className="auth-field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" className="form-input" autoComplete="address-level2" />
        </div>
        <PasswordField name="password" label="Password" autoComplete="new-password" />
        <PasswordField name="confirmPassword" label="Confirm password" autoComplete="new-password" />
        <button className="btn btn-primary auth-submit" disabled={state.loading}>
          {state.loading ? 'Creating account...' : 'Create account'}
        </button>
        <AuthLinks>
          <span>Already registered? <Link href="/login">Login</Link></span>
          <Link href="/">Back to home</Link>
        </AuthLinks>
      </form>
    </AuthCard>
  )
}

export function ForgotPasswordForm() {
  const state = useStatus()
  async function submit(formData: FormData) {
    state.setLoading(true)
    state.setError('')
    state.setMessage('')
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.get('email') }),
    })
    const result = await res.json()
    state.setLoading(false)
    if (result.success) state.setMessage(result.message)
    else state.setError(result.message || 'We could not send the reset email. Please try again.')
  }

  return (
    <AuthCard
      heading="Reset your Way2Pets password"
      subtitle="Enter your account email and we will send you a secure password reset link."
    >
      <form action={submit} className="admin-form auth-form" noValidate={false}>
        {state.message && <p className="form-message success">{state.message}</p>}
        {state.error && <p className="form-message error">{state.error}</p>}
        <div className="auth-field">
          <label htmlFor="forgot-email">Email address</label>
          <input id="forgot-email" name="email" type="email" className="form-input" autoComplete="email" required />
        </div>
        <button className="btn btn-primary auth-submit" disabled={state.loading}>
          {state.loading ? 'Sending reset link...' : 'Send reset link'}
        </button>
        <AuthLinks>
          <Link href="/login">Back to login</Link>
        </AuthLinks>
      </form>
    </AuthCard>
  )
}

export function ResetPasswordForm() {
  const state = useStatus()
  const [token] = useState(() => {
    if (typeof window === 'undefined') return ''
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return hash.get('access_token') || ''
  })

  async function submit(formData: FormData) {
    state.setLoading(true)
    state.setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: token,
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
      }),
    })
    const result = await res.json()
    if (result.success) window.location.href = '/login?reset=1'
    else {
      state.setError(result.message || 'We could not update your password. Please request a new reset link.')
      state.setLoading(false)
    }
  }

  return (
    <AuthCard
      heading="Create a new password"
      subtitle="Choose a strong password to keep your Way2Pets account secure."
    >
      <form action={submit} className="admin-form auth-form" noValidate={false}>
        {!token && <p className="form-message error">Open this page from your password reset email link.</p>}
        {state.error && <p className="form-message error">{state.error}</p>}
        <PasswordField name="password" label="New password" autoComplete="new-password" />
        <PasswordField name="confirmPassword" label="Confirm new password" autoComplete="new-password" />
        <button className="btn btn-primary auth-submit" disabled={state.loading || !token}>
          {state.loading ? 'Updating password...' : 'Update password'}
        </button>
        <AuthLinks>
          <Link href="/login">Back to login</Link>
        </AuthLinks>
      </form>
    </AuthCard>
  )
}

export function AuthCallback() {
  const [message, setMessage] = useState('Finishing login...')

  const callbackError = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const query = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return query.get('error_description') || query.get('error') || hash.get('error_description') || hash.get('error') || ''
  }, [])

  useEffect(() => {
    if (callbackError) {
      queueMicrotask(() => setMessage(friendlyGoogleError(callbackError)))
      return
    }

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    const expires_in = Number(params.get('expires_in') || 3600)
    if (!access_token || !refresh_token) {
      queueMicrotask(() => setMessage('Login callback did not include a session. Please use email and password or try again.'))
      return
    }
    fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token, refresh_token, expires_in, user: { id: '' } }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) window.location.href = '/account'
        else setMessage(result.message || 'Login failed. Please use email and password or try again.')
      })
      .catch(() => setMessage('Login failed. Please use email and password or try again.'))
  }, [callbackError])

  return (
    <section className="auth-shell" aria-label="Authentication status">
      <div className="auth-shell__inner auth-shell__inner--login">
        <AuthCard heading="Way2Pets login" subtitle="We are securely completing your account sign-in.">
          <div className="auth-callback-status">
            <p>{message}</p>
            {message !== 'Finishing login...' && <Link href="/login">Back to login</Link>}
          </div>
        </AuthCard>
      </div>
    </section>
  )
}
