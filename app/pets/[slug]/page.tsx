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
  image_ids?: string[]
  media?: { secure_url?: string; width?: number; height?: number; alt_text?: string }
}

type Props = { params: Promise<{ slug: string }> }

async function getPet(slug: string) {
  try {
    const rows = await getRows<Pet>(`pets?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*`, false)
    const pet = rows?.[0] || null
    const imageId = pet?.image_ids?.[0]
    if (pet && imageId) {
      const media = await getRows<{ id: string; secure_url?: string; width?: number; height?: number; alt_text?: string }>(`media_assets?id=eq.${imageId}&select=*&limit=1`, false)
      pet.media = media?.[0]
    }
    return pet
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
          <Image src={pet.media?.secure_url || '/logo.png'} alt={pet.media?.alt_text || pet.name || 'Way2Pets pet listing'} width={pet.media?.width || 480} height={pet.media?.height || 320} style={{ maxWidth: '100%', height: 'auto', borderRadius: 16 }} />
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
