import { sendAdminEmail } from '@/lib/email'

export type NotificationPayload = {
  formType: string
  sourcePage?: string | null
  userEmail?: string | null
  userMobile?: string | null
  userId?: string | null
  adminLink?: string | null
  fields: Record<string, unknown>
}

export async function notifyPublicForm(payload: NotificationPayload) {
  const subject = `New ${payload.formType}: ${payload.userEmail || payload.userMobile || 'Way2Pets request'}`
  const text = [
    `Form type: ${payload.formType}`,
    `Submitted: ${new Date().toISOString()}`,
    `Source page: ${payload.sourcePage || 'N/A'}`,
    `User email: ${payload.userEmail || 'N/A'}`,
    `User mobile: ${payload.userMobile || 'N/A'}`,
    `User ID: ${payload.userId || 'Guest'}`,
    `Admin link: ${payload.adminLink || 'N/A'}`,
    '',
    'Submitted fields:',
    JSON.stringify(payload.fields, null, 2),
  ].join('\n')

  try {
    await sendAdminEmail(subject, text)
  } catch (error) {
    console.error(`${payload.formType} notification failed:`, error)
  }
}
