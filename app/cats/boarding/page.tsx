import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Cat Boarding Guides | Way2Pets', description: 'Cat boarding and stress-free cat care guides for Lucknow.', path: '/cats/boarding' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Cat Boarding Guides</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Cat boarding and stress-free cat care guides for Lucknow.</p><div className="services-grid"><Link className="service-card text-card" href="/cat-boarding-in-lucknow"><div className="service-content"><h3>/cat-boarding-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/cats/boarding/best-cat-boarding-in-lucknow"><div className="service-content"><h3>/cats/boarding/best-cat-boarding-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
