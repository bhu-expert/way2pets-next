import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Cat Grooming Guides | Way2Pets', description: 'Cat grooming and Persian cat grooming advice.', path: '/cats/grooming' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Cat Grooming Guides</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Cat grooming and Persian cat grooming advice.</p><div className="services-grid"><Link className="service-card text-card" href="/cat-grooming-in-lucknow"><div className="service-content"><h3>/cat-grooming-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/cats/grooming/cat-grooming-in-lucknow"><div className="service-content"><h3>/cats/grooming/cat-grooming-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
