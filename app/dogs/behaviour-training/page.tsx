import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Dog Behaviour and Training | Way2Pets', description: 'Dog aggression, leash training and behaviour guidance.', path: '/dogs/behaviour-training' })

export default function Page() {
  return <section className="services" style={{ paddingTop: '140px' }}><h1>Dog Behaviour and Training</h1><p style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>Dog aggression, leash training and behaviour guidance.</p><div className="services-grid"><Link className="service-card text-card" href="/dogs/behaviour-training/dog-aggression-training-guide"><div className="service-content"><h3>/dogs/behaviour-training/dog-aggression-training-guide</h3><p>Read this Way2Pets guide.</p></div></Link><Link className="service-card text-card" href="/dogs/behaviour-training/how-to-leash-train-a-dog"><div className="service-content"><h3>/dogs/behaviour-training/how-to-leash-train-a-dog</h3><p>Read this Way2Pets guide.</p></div></Link></div></section>
}
