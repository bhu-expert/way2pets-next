import type { Metadata } from 'next'
import FindPetPageContent from '@/components/FindPetPageContent'

export const metadata: Metadata = {
  title: 'Adopt Puppy Kitten Lucknow | Way2Pets',
  description: 'Find your perfect furry friend. Adopt puppy, kitten, or dog in Lucknow. We have many rescued pets waiting for a forever home. Visit Way2Pets today.',
}

import { getRows } from '@/lib/supabase'

type Pet = { id: string; name: string; slug: string; pet_type: string; breed?: string; age?: string; availability_status?: string; description?: string; image_ids?: string[]; media?: { secure_url?: string; width?: number; height?: number; alt_text?: string } }

async function getPets() {
  try {
    const pets = await getRows<Pet>('pets?status=eq.published&select=*&order=created_at.desc&limit=12', false) || []
    const ids = pets.flatMap((pet) => pet.image_ids || []).filter(Boolean)
    if (!ids.length) return pets
    const mediaRows = await getRows<{ id: string; secure_url?: string; width?: number; height?: number; alt_text?: string }>(`media_assets?id=in.(${ids.join(',')})&select=*`, false) || []
    return pets.map((pet) => ({ ...pet, media: mediaRows.find((media) => media.id === pet.image_ids?.[0]) }))
  } catch { return [] }
}

export default async function FindAPetPage() {
  const pets = await getPets()
  return <FindPetPageContent pets={pets} />
}
