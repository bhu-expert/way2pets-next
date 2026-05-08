import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import { buildMetadata } from '@/lib/seo'
import { getRows } from '@/lib/supabase'

type Pet = {
  name: string
  slug: string
  pet_type: string
  breed?: string
  age?: string
  gender?: string
  price?: number
  location?: string
  vaccination_status?: string
  temperament?: string
  health_notes?: string
  description?: string
  availability_status?: string
}

type Props = { params: Promise<{ slug: string }> }

async function getPet(slug: string) {
  try {
    const rows = await getRows<Pet>(`pets?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*`, false)
    return rows?.[0] || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pet = await getPet(slug)
  if (!pet) return buildMetadata({ title: 'Pet Listing | Way2Pets', description: 'Pet listing from Way2Pets Lucknow.', path: `/pets/${slug}` })
  return buildMetadata({ title: `${pet.name} ${pet.breed || ''} | Way2Pets`, description: pet.description || `Meet ${pet.name}, a ${pet.pet_type} listed by Way2Pets Lucknow.`, path: `/pets/${slug}` })
}

export default async function PetPage({ params }: Props) {
  const { slug } = await params
  const pet = await getPet(slug)
  if (!pet) notFound()

  return (
    <section className="contact-section" style={{ paddingTop: '140px' }}>
      <div className="contact-container">
        <div className="contact-info">
          <Image src="/logo.png" alt="Way2Pets pet listing" width={180} height={90} />
          <h1>{pet.name}</h1>
          <p>{pet.breed} · {pet.age} · {pet.gender}</p>
          <p>Status: {pet.availability_status || 'available'}</p>
          {pet.price ? <p>Price: ₹{pet.price}</p> : null}
        </div>
        <div className="contact-form-wrapper">
          <h2>About {pet.name}</h2>
          <p>{pet.description}</p>
          <p><strong>Vaccination:</strong> {pet.vaccination_status || 'Ask Way2Pets'}</p>
          <p><strong>Temperament:</strong> {pet.temperament || 'Ask Way2Pets'}</p>
          <h3>Enquire about this pet</h3>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
