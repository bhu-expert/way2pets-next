import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PetDetailContent from '@/components/PetDetailContent'
import { attachPetMedia, pickPetThumbnail, type PetMedia } from '@/lib/pet-media'
import { buildMetadata } from '@/lib/seo'
import { getRows } from '@/lib/supabase'

type Pet = {
  id: string
  name: string
  slug: string
  pet_type: string
  breed?: string
  age?: string
  gender?: string
  listing_type?: string
  price?: number
  location?: string
  vaccination_status?: string
  temperament?: string
  health_notes?: string
  description?: string
  availability_status?: string
  image_ids?: string[]
  featured_image_id?: string
  meta_title?: string
  meta_description?: string
  media_items?: PetMedia[]
}

type Props = { params: Promise<{ slug: string }> }

async function getPet(slug: string) {
  try {
    const rows = await getRows<Pet>(`pets?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*`, false)
    const pet = rows?.[0] || null
    if (!pet) return null
    const [withMedia] = await attachPetMedia([pet], false)
    return withMedia
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pet = await getPet(slug)
  if (!pet) return buildMetadata({ title: 'Pet Listing | Way2Pets', description: 'Pet listing from Way2Pets Lucknow.', path: `/pets/${slug}` })
  const thumb = pickPetThumbnail(pet)
  const image = thumb?.media_assets?.secure_url
  return buildMetadata({
    title: pet.meta_title || `${pet.name} ${pet.breed || ''} | Way2Pets`,
    description: pet.meta_description || pet.description || `Meet ${pet.name}, a ${pet.pet_type} listed by Way2Pets Lucknow.`,
    path: `/pets/${slug}`,
    image,
  })
}

export default async function PetPage({ params }: Props) {
  const { slug } = await params
  const pet = await getPet(slug)
  if (!pet) notFound()

  return <PetDetailContent pet={pet} />
}
