import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Cats Hub | Way2Pets', description: 'Cat boarding, breeds, health, grooming and kitten care from Way2Pets Lucknow.', path: '/cats' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Cats Hub</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Cat boarding, breeds, health, grooming and kitten care from Way2Pets Lucknow.</p><div className="services-grid"><Link className="service-card text-card" href="/cats/boarding"><div className="service-content"><h3>/cats/boarding</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/cats/breeds"><div className="service-content"><h3>/cats/breeds</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/cats/health"><div className="service-content"><h3>/cats/health</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/cats/grooming"><div className="service-content"><h3>/cats/grooming</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/cats/behaviour-training"><div className="service-content"><h3>/cats/behaviour-training</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
