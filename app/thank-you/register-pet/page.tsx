import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Thank You | Way2Pets', robots: { index: false, follow: false } }

export default function ThankYouPage() {
  return (
    <section className="seo-hero">
      <div>
        <p className="eyebrow">Thank you</p>
        <h1>Your request has been received</h1>
        <p>Way2Pets will contact you soon. For urgent support, call or WhatsApp +91 73761 26261.</p>
        <div className="seo-cta-row">
          <Link className="btn btn-primary" href="/">Back Home</Link>
          <Link className="btn btn-secondary" href="/gallery">View Gallery</Link>
        </div>
      </div>
    </section>
  )
}
