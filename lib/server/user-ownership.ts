import { updateRows, upsertRows } from '@/lib/supabase'

function clean(value?: string | null) {
  return value?.trim().toLowerCase() || null
}

export async function ensureUserProfile(userId: string, email?: string | null, data: Record<string, unknown> = {}) {
  await upsertRows('user_profiles?on_conflict=id', {
    id: userId,
    email: clean(email),
    updated_at: new Date().toISOString(),
    ...data,
  }, true)
}

export async function linkExistingRecordsToUser(userId: string, email?: string | null, mobile?: string | null) {
  const normalizedEmail = clean(email)
  const normalizedMobile = mobile?.trim() || null
  const body = { user_id: userId }
  const jobs: Promise<unknown>[] = []

  if (normalizedEmail) {
    const encoded = encodeURIComponent(normalizedEmail)
    jobs.push(updateRows(`boarding_bookings?user_id=is.null&or=(owner_email.eq.${encoded},email.eq.${encoded})`, body, true))
    jobs.push(updateRows(`pet_registrations?user_id=is.null&or=(owner_email.eq.${encoded},email.eq.${encoded})`, body, true))
    jobs.push(updateRows(`pets?user_id=is.null&or=(owner_email.eq.${encoded},email.eq.${encoded})`, body, true))
    jobs.push(updateRows(`contact_leads?user_id=is.null&email=eq.${encoded}`, body, true))
  }

  if (normalizedMobile) {
    const encodedMobile = encodeURIComponent(normalizedMobile)
    jobs.push(updateRows(`boarding_bookings?user_id=is.null&owner_mobile=eq.${encodedMobile}`, body, true))
    jobs.push(updateRows(`pet_registrations?user_id=is.null&owner_mobile=eq.${encodedMobile}`, body, true))
    jobs.push(updateRows(`contact_leads?user_id=is.null&mobile=eq.${encodedMobile}`, body, true))
  }

  await Promise.allSettled(jobs)
}
