import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PetDetailContent from '@/components/PetDetailContent'
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

  return <PetDetailContent pet={pet} />
}
