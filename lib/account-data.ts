import { getRows } from './supabase'

export type Row = Record<string, unknown> & { id?: string; created_at?: string }
const enc = encodeURIComponent

export async function getProfile(userId: string) {
  const rows = await getRows<Row>(`user_profiles?id=eq.${enc(userId)}&select=*&limit=1`, true)
  return rows?.[0] || null
}
export async function getUserRows(table: string, userId: string, limit = 100) {
  return (await getRows<Row>(`${table}?user_id=eq.${enc(userId)}&select=*&order=created_at.desc&limit=${limit}`, true)) || []
}
export function fmt(value: unknown) { return value ? String(value) : '-' }
export function date(value: unknown) { return value ? new Date(String(value)).toLocaleDateString('en-IN') : '-' }
