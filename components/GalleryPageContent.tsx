'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useI18n } from '@/src/i18n'

type GalleryRow = {
  id: string
  title?: string
  alt_text?: string
  caption?: string
  category?: string
  subcategory?: string
  media_assets?: { secure_url?: string; width?: number; height?: number; alt_text?: string }
}

function galleryAlt(row: GalleryRow) {
  return row.alt_text || row.media_assets?.alt_text || row.title || 'Way2Pets gallery image'
}

export default function GalleryPageContent({ rows }: { rows: GalleryRow[] }) {
  const { t } = useI18n()
  const [activeImage, setActiveImage] = useState<GalleryRow | null>(null)

  useEffect(() => {
    if (!activeImage) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.body.classList.add('gallery-lightbox-open')

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('gallery-lightbox-open')
    }
  }, [activeImage])

  const activeImageUrl = activeImage?.media_assets?.secure_url

  return (
    <section className="services" style={{ paddingTop: '140px' }}>
      <h1>{t.galleryPage.title}</h1>
      <p style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 30px' }}>{t.galleryPage.intro}</p>
      <div className="blog-grid gallery-grid">
        {rows.length === 0 ? (
          <article className="blog-card">
            <div className="blog-content">
              <h2>{t.galleryPage.emptyTitle}</h2>
              <p>{t.galleryPage.emptyText}</p>
            </div>
          </article>
        ) : (
          rows.map((row) => {
            const imageUrl = row.media_assets?.secure_url
            const alt = galleryAlt(row)
            const title = row.title || alt
            const category = [row.category, row.subcategory].filter(Boolean).join(' / ')

            return (
              <article
                className="blog-card gallery-card"
                key={row.id}
                onClick={() => imageUrl && setActiveImage(row)}
                onKeyDown={(event) => {
                  if (imageUrl && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    setActiveImage(row)
                  }
                }}
                role={imageUrl ? 'button' : undefined}
                tabIndex={imageUrl ? 0 : undefined}
                aria-label={imageUrl ? `Open full-size image: ${title}` : undefined}
              >
                {imageUrl ? (
                  <div className="gallery-thumbnail">
                    <Image
                      className="gallery-thumbnail-img"
                      src={imageUrl}
                      alt={alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : null}
                <div className="blog-content gallery-card-content">
                  {category ? <span className="blog-date">{category}</span> : null}
                  <h2 className="blog-title">{title}</h2>
                  {row.caption ? <p>{row.caption}</p> : null}
                </div>
              </article>
            )
          })
        )}
      </div>

      {activeImage && activeImageUrl ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveImage(null)
          }}
        >
          <div className="gallery-lightbox-panel">
            <button className="gallery-lightbox-close" type="button" onClick={() => setActiveImage(null)} aria-label="Close full-size gallery image">
              ×
            </button>
            <div className="gallery-lightbox-image-wrap">
              <Image
                className="gallery-lightbox-img"
                src={activeImageUrl}
                alt={galleryAlt(activeImage)}
                width={activeImage.media_assets?.width || 1400}
                height={activeImage.media_assets?.height || 1000}
                sizes="95vw"
                priority
              />
            </div>
            <div className="gallery-lightbox-copy">
              <h2 id="gallery-lightbox-title">{activeImage.title || galleryAlt(activeImage)}</h2>
              {activeImage.caption ? <p>{activeImage.caption}</p> : null}
              <span>Alt text: {galleryAlt(activeImage)}</span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
