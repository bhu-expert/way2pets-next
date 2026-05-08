import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAuthUser, isAllowedAdmin } from './supabase'

export const adminCookieName = 'w2p_admin_session'

export async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(adminCookieName)?.value
  const user = await getAuthUser(token)

  if (!user || !isAllowedAdmin(user.email)) {
    redirect('/admin/login')
  }

  return user
}
