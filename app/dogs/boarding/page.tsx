import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Dog Boarding Guides | Way2Pets', description: 'Dog boarding and dog hostel guides for Lucknow pet parents.', path: '/dogs/boarding' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Dog Boarding Guides</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Dog boarding and dog hostel guides for Lucknow pet parents.</p><div className="services-grid"><Link className="service-card text-card" href="/dog-boarding-in-lucknow"><div className="service-content"><h3>/dog-boarding-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/boarding/best-dog-boarding-in-lucknow"><div className="service-content"><h3>/dogs/boarding/best-dog-boarding-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
