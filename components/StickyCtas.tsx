import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export default function StickyCtas() {
  return (
    <div className="sticky-ctas" aria-label="Quick contact actions">
      <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="sticky-call">Call Now</a>
      <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="sticky-whatsapp">WhatsApp</a>
      <Link href="/pet-boarding-for-cat-and-dog-in-lucknow" className="sticky-book">Book Boarding</Link>
    </div>
  )
}
