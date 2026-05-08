import type { Metadata } from 'next'
import Image from 'next/image'
import { buildMetadata } from '@/lib/seo'
import { getRows } from '@/lib/supabase'

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
  media_assets?: { secure_url?: string; width?: number; height?: number; alt_text?: string }
}

export default async function GalleryPage() {
  let rows: GalleryRow[] = []
  try {
    rows = await getRows<GalleryRow>('gallery_images?is_visible=eq.true&select=*,media_assets(*)', false) || []
  } catch {}

  return (
    <section className="services" style={{ paddingTop: '140px' }}>
      <h1>Way2Pets Gallery</h1>
      <p style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 30px' }}>Photos from boarding, grooming, puppies, kittens, happy pets and the Way2Pets facility in Lucknow.</p>
      <div className="blog-grid">
        {rows.length === 0 ? (
          <article className="blog-card"><div className="blog-content"><h2>Gallery coming soon</h2><p>Upload Cloudinary images from the admin gallery manager after Supabase is connected.</p></div></article>
        ) : rows.map((row) => (
          <article className="blog-card" key={row.id}>
            {row.media_assets?.secure_url ? <Image className="blog-img" src={row.media_assets.secure_url} alt={row.alt_text || row.media_assets.alt_text || row.title || 'Way2Pets gallery image'} width={row.media_assets.width || 900} height={row.media_assets.height || 600} /> : null}
            <div className="blog-content"><span className="blog-date">{row.category}</span><h2 className="blog-title">{row.title}</h2><p>{row.caption}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}
