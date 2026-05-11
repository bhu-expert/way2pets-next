'use client'

import Image from 'next/image'
import { useI18n } from '@/src/i18n'

type GalleryRow = { id: string; title?: string; alt_text?: string; caption?: string; category?: string; subcategory?: string; media_assets?: { secure_url?: string; width?: number; height?: number; alt_text?: string } }

export default function GalleryPageContent({ rows }: { rows: GalleryRow[] }) {
  const { t } = useI18n()
  return <section className="services" style={{ paddingTop: '140px' }}><h1>{t.galleryPage.title}</h1><p style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 30px' }}>{t.galleryPage.intro}</p><div className="blog-grid">{rows.length === 0 ? <article className="blog-card"><div className="blog-content"><h2>{t.galleryPage.emptyTitle}</h2><p>{t.galleryPage.emptyText}</p></div></article> : rows.map((row) => <article className="blog-card" key={row.id}>{row.media_assets?.secure_url ? <Image className="blog-img" src={row.media_assets.secure_url} alt={row.alt_text || row.media_assets.alt_text || row.title || 'Way2Pets gallery image'} width={row.media_assets.width || 900} height={row.media_assets.height || 600} /> : null}<div className="blog-content"><span className="blog-date">{[row.category, row.subcategory].filter(Boolean).join(' / ')}</span><h2 className="blog-title">{row.title}</h2><p>{row.caption}</p></div></article>)}</div></section>
}
