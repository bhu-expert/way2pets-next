type Json = Record<string, unknown> | Record<string, unknown>[]

export type AuthUser = { id: string; email?: string }
export type AuthSession = {
  access_token: string
  refresh_token: string
  expires_in?: number
  expires_at?: number
  user: AuthUser
}

export class SupabaseRestError extends Error {
  table: string
  status: number
  body: string
  code?: string
  details?: string
  hint?: string

  constructor(table: string, status: number, body: string) {
    let parsed: { message?: string; code?: string; details?: string; hint?: string } = {}
    try { parsed = JSON.parse(body) } catch {}
    super(parsed.message || `Supabase ${table} request failed: ${status} ${body}`)
    this.name = 'SupabaseRestError'
    this.table = table
    this.status = status
    this.body = body
    this.code = parsed.code
    this.details = parsed.details
    this.hint = parsed.hint
  }
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export function hasSupabaseConfig(serviceRole = false) {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && (!serviceRole || SUPABASE_SERVICE_ROLE_KEY))
}

function headers(serviceRole = false, accessToken?: string) {
  const key = serviceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY
  return {
    apikey: key || '',
    Authorization: `Bearer ${accessToken || key || ''}`,
    'Content-Type': 'application/json',
  }
}

export async function supabaseRest<T>(
  table: string,
  init: RequestInit & { serviceRole?: boolean; accessToken?: string } = {},
): Promise<T | null> {
  if (!hasSupabaseConfig(init.serviceRole)) {
    console.warn(`Supabase is not configured; skipped ${table} request.`)
    return null
  }

  const params = table.includes('?') ? table : `${table}?select=*`
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${params}`, {
    ...init,
    headers: {
      ...headers(init.serviceRole, init.accessToken),
      Prefer: init.method && init.method !== 'GET' ? 'return=representation' : '',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new SupabaseRestError(table, res.status, text)
  }

  if (res.status === 204) return null
  return (await res.json()) as T
}

export async function insertRow<T>(table: string, body: Json, serviceRole = true) {
  return supabaseRest<T[]>(table, {
    method: 'POST',
    serviceRole,
    body: JSON.stringify(body),
  })
}

export async function updateRows<T>(tableWithFilter: string, body: Json, serviceRole = true) {
  return supabaseRest<T[]>(tableWithFilter, {
    method: 'PATCH',
    serviceRole,
    body: JSON.stringify(body),
  })
}

export async function deleteRows(tableWithFilter: string, serviceRole = true) {
  return supabaseRest<null>(tableWithFilter, {
    method: 'DELETE',
    serviceRole,
  })
}

export async function upsertRows<T>(tableWithQuery: string, body: Json, serviceRole = true) {
  return supabaseRest<T[]>(tableWithQuery, {
    method: 'POST',
    serviceRole,
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(body),
  })
}

export async function getRows<T>(tableWithQuery: string, serviceRole = false, accessToken?: string) {
  return supabaseRest<T[]>(tableWithQuery, { serviceRole, accessToken })
}

export async function signInWithPassword(email: string, password: string) {
  if (!hasSupabaseConfig(false)) throw new Error('Supabase auth is not configured.')

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Invalid login.')
  }

  return (await res.json()) as AuthSession
}

export async function refreshAuthSession(refreshToken?: string) {
  if (!refreshToken || !hasSupabaseConfig(false)) return null

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: 'no-store',
  })

  if (!res.ok) return null
  return (await res.json()) as AuthSession
}

export async function signOutAuthSession(accessToken?: string) {
  if (!accessToken || !hasSupabaseConfig(false)) return

  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: 'POST',
    headers: headers(false, accessToken),
    cache: 'no-store',
  }).catch((error) => {
    console.error('Supabase sign out failed:', error)
  })
}

export async function getAuthUser(accessToken?: string) {
  if (!accessToken || !hasSupabaseConfig(false)) return null

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: headers(false, accessToken),
    cache: 'no-store',
  })

  if (!res.ok) return null
  return (await res.json()) as AuthUser
}

export function isAllowedAdmin(email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase()
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

  if (!normalizedEmail || !adminEmail) return false
  return normalizedEmail === adminEmail
}


export async function signUpWithPassword(email: string, password: string, metadata: Record<string, unknown> = {}) {
  if (!hasSupabaseConfig(false)) throw new Error('Supabase auth is not configured.')

  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ email, password, data: metadata }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Signup failed.')
  }

  return (await res.json()) as Partial<AuthSession> & { user?: AuthUser | null; session?: AuthSession | null }
}

export async function updateAuthPassword(accessToken: string, password: string) {
  if (!hasSupabaseConfig(false)) throw new Error('Supabase auth is not configured.')

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: headers(false, accessToken),
    body: JSON.stringify({ password }),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Password update failed.')
  return (await res.json()) as AuthUser
}

export async function sendPasswordRecovery(email: string, redirectTo: string) {
  if (!hasSupabaseConfig(false)) throw new Error('Supabase auth is not configured.')

  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ email, redirect_to: redirectTo }),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Could not send password reset email.')
}
