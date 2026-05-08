import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Dog Grooming Guides | Way2Pets', description: 'Dog grooming guidance for Lucknow and Indian weather.', path: '/dogs/grooming' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Dog Grooming Guides</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Dog grooming guidance for Lucknow and Indian weather.</p><div className="services-grid"><Link className="service-card text-card" href="/dog-grooming-in-lucknow"><div className="service-content"><h3>/dog-grooming-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/grooming/dog-grooming-in-lucknow"><div className="service-content"><h3>/dogs/grooming/dog-grooming-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
