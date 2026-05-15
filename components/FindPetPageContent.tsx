'use client'

import Image from 'next/image'
import Link from 'next/link'
import Hero from '@/components/Hero'
import FindPetForm from '@/components/FindPetForm'
import { mediaKind, petMediaAlt, petMediaPoster, pickPetThumbnail, type PetMedia } from '@/lib/pet-media'
import { useI18n } from '@/src/i18n'

type Pet = { id: string; name: string; slug: string; pet_type: string; breed?: string; age?: string; listing_type?: string; price?: number; location?: string; availability_status?: string; description?: string; media_items?: PetMedia[] }

function PetCardMedia({ pet }: { pet: Pet }) {
  const media = pickPetThumbnail(pet)
  const asset = media?.media_assets
  const poster = petMediaPoster(media)
  if (!media || !asset?.secure_url) return <div className="pet-card-placeholder">No image</div>
  if (mediaKind(media) === 'video') {
    return poster ? <Image className="blog-img pet-card-img" src={poster} alt={petMediaAlt(pet, media)} width={asset.width || 900} height={asset.height || 600} /> : <div className="pet-card-placeholder">Video</div>
  }
  return <Image className="blog-img pet-card-img" src={asset.secure_url} alt={petMediaAlt(pet, media)} width={asset.width || 900} height={asset.height || 600} />
}

export default function FindPetPageContent({ pets }: { pets: Pet[] }) {
  const { t } = useI18n()

  return (
    <>
      <Hero title={t.findPet.heroTitle} subtitle={t.findPet.heroSubtitle} imageUrl="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="60vh" />
      <section className="services" style={{ background: 'var(--light-green)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '0 20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>{t.findPet.whyTitle}</h2>
            <ul style={{ marginTop: '20px', listStyle: 'disc', paddingLeft: '20px' }}>{t.findPet.reasons.map((item) => <li key={item} style={{ marginBottom: '10px' }}>{item}</li>)}</ul>
          </div>
          <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3>{t.findPet.matchTitle}</h3><FindPetForm />
          </div>
        </div>
      </section>
      <section className="services">
        <h2>{t.findPet.availableTitle}</h2>
        <div className="blog-grid">
          {pets.length === 0 ? (
            <article className="blog-card"><div className="blog-content"><h3 className="blog-title">{t.findPet.emptyTitle}</h3><p>{t.findPet.emptyText}</p></div></article>
          ) : pets.map((pet) => (
            <article key={pet.id} className="blog-card">
              <PetCardMedia pet={pet} />
              <div className="blog-content">
                <span className="blog-date">{pet.pet_type} · {pet.listing_type || 'listing'} · {pet.availability_status || t.common.available}</span>
                <h3 className="blog-title">{pet.name}</h3>
                <p>{pet.breed} {pet.age ? `· ${pet.age}` : ''}</p>
                {pet.listing_type === 'sale' && pet.price ? <p><strong>₹{Number(pet.price).toLocaleString('en-IN')}</strong></p> : null}
                <p>{pet.description}</p>
                <Link href={`/pets/${pet.slug}`} style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>{t.common.viewPet} →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="reviews">
        <h2>{t.findPet.happyTitle}</h2>
        <div className="reviews-grid">{t.findPet.testimonials.map((review) => <div className="review-card" key={review.name}><p>&ldquo;{review.text}&rdquo;</p><div className="stars">★★★★★</div><div className="reviewer">- <span style={{ fontWeight: 600 }}>{review.name}</span></div></div>)}</div>
      </section>
    </>
  )
}
