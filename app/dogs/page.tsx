import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Dogs Hub | Way2Pets', description: 'Dog boarding, breeds, health, grooming and behaviour guides from Way2Pets Lucknow.', path: '/dogs' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Dogs Hub</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Dog boarding, breeds, health, grooming and behaviour guides from Way2Pets Lucknow.</p><div className="services-grid"><Link className="service-card text-card" href="/dogs/boarding"><div className="service-content"><h3>/dogs/boarding</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/breeds"><div className="service-content"><h3>/dogs/breeds</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/health"><div className="service-content"><h3>/dogs/health</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/grooming"><div className="service-content"><h3>/dogs/grooming</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/behaviour-training"><div className="service-content"><h3>/dogs/behaviour-training</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
