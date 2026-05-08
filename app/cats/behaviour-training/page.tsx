import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Cat Behaviour Guides | Way2Pets', description: 'Cat behaviour, litter and home adjustment guides.', path: '/cats/behaviour-training' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Cat Behaviour Guides</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Cat behaviour, litter and home adjustment guides.</p><div className="services-grid"><Link className="service-card text-card" href="/cats/health/how-to-care-for-kitten-at-home"><div className="service-content"><h3>/cats/health/how-to-care-for-kitten-at-home</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
