import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getRows } from '@/lib/supabase'
import GalleryPageContent from '@/components/GalleryPageContent'

export const metadata: Metadata = buildMetadata({
  title: 'Way2Pets Gallery | Boarding, Puppies, Kittens & Grooming',
  description: 'View Way2Pets Lucknow gallery images for boarding, grooming, puppies, kittens, happy pets and facility photos.',
  path: '/gallery',
})

type GalleryRow = {
  id: string
  title?: string
  alt_text?: string
  caption?: string
  category?: string
  subcategory?: string
  media_assets?: { secure_url?: string; width?: number; height?: number; alt_text?: string }
}

export default async function GalleryPage() {
  let rows: GalleryRow[] = []
  try {
    rows = await getRows<GalleryRow>('gallery_images?is_visible=eq.true&select=*,media_assets(*)', false) || []
  } catch {}

  return <GalleryPageContent rows={rows} />
}
