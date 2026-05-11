type Json = Record<string, unknown> | Record<string, unknown>[]

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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

export async function getRows<T>(tableWithQuery: string, serviceRole = false, accessToken?: string) {
  return supabaseRest<T[]>(tableWithQuery, { serviceRole, accessToken })
}

export async function signInWithPassword(email: string, password: string) {
  if (!hasSupabaseConfig(false)) throw new Error('Supabase auth is not configured.')

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error('Invalid admin login.')
  }

  return (await res.json()) as { access_token: string; refresh_token: string; user: { email?: string } }
}

export async function getAuthUser(accessToken?: string) {
  if (!accessToken || !hasSupabaseConfig(false)) return null

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: headers(false, accessToken),
    cache: 'no-store',
  })

  if (!res.ok) return null
  return (await res.json()) as { id: string; email?: string }
}

export function isAllowedAdmin(email?: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return Boolean(email)
  return email?.toLowerCase() === adminEmail.toLowerCase()
}
