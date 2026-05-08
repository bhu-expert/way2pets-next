import nodemailer from 'nodemailer'

export function hasEmailConfig() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
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
    to: process.env.EMAIL_USER,
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
