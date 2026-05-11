'use client'

import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { useI18n } from '@/src/i18n'

export default function StickyCtas() {
  const { t } = useI18n()

  return (
    <div className="sticky-ctas" aria-label={t.common.quickActions}>
      <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="sticky-call">{t.common.callNow}</a>
      <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="sticky-whatsapp">{t.common.whatsapp}</a>
      <Link href="/pet-boarding-for-cat-and-dog-in-lucknow" className="sticky-book">{t.common.bookBoarding}</Link>
    </div>
  )
}
