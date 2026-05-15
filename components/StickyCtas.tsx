'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localized } from '@/lib/website-content'
import { useI18n } from '@/src/i18n'
import { useWebsiteContent } from './WebsiteContentProvider'

export default function StickyCtas() {
  const pathname = usePathname()
  const { language, t } = useI18n()
  const content = useWebsiteContent()
  const buttons = content.items.floating_buttons || []

  if (pathname.startsWith('/admin')) return null

  return (
    <div className="sticky-ctas" aria-label={t.common.quickActions}>
      {buttons.map((button) => {
        const label = localized(button, 'title', language)
        const href = button.button_link || '#'
        const className = button.item_key === 'call_now' ? 'sticky-call' : button.item_key === 'whatsapp' ? 'sticky-whatsapp' : 'sticky-book'
        if (href.startsWith('http') || href.startsWith('tel:')) {
          return <a key={button.item_key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className={className}>{label}</a>
        }
        return <Link key={button.item_key} href={href} className={className}>{label}</Link>
      })}
    </div>
  )
}
