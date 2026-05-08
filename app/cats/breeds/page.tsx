import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Cat Breeds | Way2Pets', description: 'Cat breed and kitten selection guidance for Indian homes.', path: '/cats/breeds' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Cat Breeds</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Cat breed and kitten selection guidance for Indian homes.</p><div className="services-grid"><Link className="service-card text-card" href="/kitten-for-sale-in-lucknow"><div className="service-content"><h3>/kitten-for-sale-in-lucknow</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
