import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Dog Breeds in India | Way2Pets', description: 'Breed selection guides for Indian families, apartments and first-time pet parents.', path: '/dogs/breeds' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Dog Breeds in India</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Breed selection guides for Indian families, apartments and first-time pet parents.</p><div className="services-grid"><Link className="service-card text-card" href="/dogs/breeds/top-10-dog-breeds-in-india"><div className="service-content"><h3>/dogs/breeds/top-10-dog-breeds-in-india</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/breeds/best-dog-breeds-for-indian-families"><div className="service-content"><h3>/dogs/breeds/best-dog-breeds-for-indian-families</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/breeds/best-dogs-for-apartments-in-india"><div className="service-content"><h3>/dogs/breeds/best-dogs-for-apartments-in-india</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
