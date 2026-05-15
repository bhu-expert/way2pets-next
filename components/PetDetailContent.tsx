'use client'

import Image from 'next/image'
import { useState } from 'react'
import ContactForm from '@/components/ContactForm'
import { mediaKind, petMediaAlt, petMediaPoster, petMediaUrl, sortPetMedia, type PetMedia } from '@/lib/pet-media'
import { useI18n } from '@/src/i18n'

type Pet = { name: string; slug: string; pet_type: string; breed?: string; age?: string; gender?: string; listing_type?: string; price?: number; location?: string; vaccination_status?: string; temperament?: string; health_notes?: string; description?: string; availability_status?: string; media_items?: PetMedia[] }

function MediaFigure({ pet, media, featured = false, onOpen }: { pet: Pet; media: PetMedia; featured?: boolean; onOpen: () => void }) {
  const isVideo = mediaKind(media) === 'video'
  const asset = media.media_assets
  const url = petMediaUrl(media)
  const poster = petMediaPoster(media)
  const title = media.title || asset?.title
  const caption = media.caption || asset?.caption
  return (
    <figure className={featured ? 'pet-detail-media-featured' : 'pet-detail-media-thumb'}>
      {isVideo ? (
        <video src={url} poster={poster || undefined} controls preload="metadata" title={title || `${pet.name} puppy video`} />
      ) : (
        <button type="button" className="pet-detail-image-button" onClick={onOpen} aria-label="Open pet image full size">
          <Image src={url || '/logo.png'} alt={petMediaAlt(pet, media)} width={asset?.width || 900} height={asset?.height || 650} className="pet-detail-image" />
        </button>
      )}
      {(title || caption) ? <figcaption>{title ? <strong>{title}</strong> : null}{caption ? <span>{caption}</span> : null}</figcaption> : null}
    </figure>
  )
}

export default function PetDetailContent({ pet }: { pet: Pet }) {
  const { t } = useI18n()
  const mediaItems = sortPetMedia(pet.media_items || [])
  const [lightbox, setLightbox] = useState<PetMedia | null>(null)
  const featured = mediaItems[0]
  const rest = mediaItems.slice(1)

  return (
    <section className="contact-section pet-detail-section" style={{ paddingTop: '140px' }}>
      <div className="contact-container pet-detail-container">
        <div className="contact-info">
          {featured ? <MediaFigure pet={pet} media={featured} featured onOpen={() => setLightbox(featured)} /> : <div className="pet-detail-placeholder">No image</div>}
          {rest.length ? <div className="pet-detail-gallery">{rest.map((item) => <MediaFigure key={item.id} pet={pet} media={item} onOpen={() => setLightbox(item)} />)}</div> : null}
          <h1>{pet.name}</h1>
          <p>{pet.breed} · {pet.age} · {pet.gender}</p>
          <p>{t.common.status}: {pet.availability_status || t.common.available}</p>
          {pet.price ? <p>{t.common.price}: ₹{Number(pet.price).toLocaleString('en-IN')}</p> : null}
        </div>
        <div className="contact-form-wrapper">
          <h2>{t.petDetail.about} {pet.name}</h2>
          <p>{pet.description}</p>
          <p><strong>{t.petDetail.vaccination}</strong> {pet.vaccination_status || t.common.askWay2Pets}</p>
          <p><strong>{t.petDetail.temperament}</strong> {pet.temperament || t.common.askWay2Pets}</p>
          <h3>{t.petDetail.enquire}</h3>
          <ContactForm />
        </div>
      </div>
      {lightbox ? (
        <div className="pet-lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" className="pet-lightbox-close" onClick={() => setLightbox(null)}>×</button>
          <Image src={petMediaUrl(lightbox)} alt={petMediaAlt(pet, lightbox)} width={lightbox.media_assets?.width || 1200} height={lightbox.media_assets?.height || 900} className="pet-lightbox-image" />
        </div>
      ) : null}
    </section>
  )
}
