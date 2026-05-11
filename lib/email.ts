import nodemailer from 'nodemailer'
import { getRows } from './supabase'

export function hasEmailConfig() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
}

export async function getNotificationEmail() {
  try {
    const rows = await getRows<{ value_json?: { value?: string; email?: string } }>('site_settings?key=eq.notification_email&select=value_json&limit=1', true)
    const fromSettings = rows?.[0]?.value_json?.value || rows?.[0]?.value_json?.email
    if (fromSettings) return fromSettings
  } catch {}
  return process.env.NOTIFICATION_EMAIL || 'way2pets.com@gmail.com' || process.env.ADMIN_EMAIL || process.env.EMAIL_USER
}

export async function sendAdminEmail(subject: string, text: string) {
  if (!hasEmailConfig()) {
    console.warn(`Email is not configured; skipped notification: ${subject}`)
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: await getNotificationEmail(),
    subject,
    text,
  })
}

export async function sendUserEmail(to: string | null | undefined, subject: string, text: string) {
  if (!to || !hasEmailConfig()) return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  })
}
