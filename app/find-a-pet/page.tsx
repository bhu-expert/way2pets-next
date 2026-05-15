import type { Metadata } from 'next'
import FindPetPageContent from '@/components/FindPetPageContent'
import { attachPetMedia, type PetMedia } from '@/lib/pet-media'
import { getRows } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Adopt Puppy Kitten Lucknow | Way2Pets',
  description: 'Find your perfect furry friend. Adopt puppy, kitten, or dog in Lucknow. We have many rescued pets waiting for a forever home. Visit Way2Pets today.',
}

type Pet = { id: string; name: string; slug: string; pet_type: string; breed?: string; age?: string; listing_type?: string; price?: number; location?: string; availability_status?: string; description?: string; image_ids?: string[]; featured_image_id?: string; media_items?: PetMedia[] }

async function getPets() {
  try {
    const pets = await getRows<Pet>('pets?status=eq.published&select=*&order=created_at.desc&limit=12', false) || []
    return attachPetMedia(pets, false)
  } catch { return [] }
}

export default async function FindAPetPage() {
  const pets = await getPets()
  return <FindPetPageContent pets={pets} />
}
