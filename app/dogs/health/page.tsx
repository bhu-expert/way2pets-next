import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Dog Health Guides | Way2Pets', description: 'Dog health, summer care, tick prevention and natural care advice.', path: '/dogs/health' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Dog Health Guides</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Dog health, summer care, tick prevention and natural care advice.</p><div className="services-grid"><Link className="service-card text-card" href="/dogs/health/how-to-care-for-dog-in-summer"><div className="service-content"><h3>/dogs/health/how-to-care-for-dog-in-summer</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
