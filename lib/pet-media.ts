import { getRows } from './supabase'

export type PetMediaAsset = {
  id?: string
  secure_url?: string
  width?: number | null
  height?: number | null
  alt_text?: string | null
  title?: string | null
  caption?: string | null
  resource_type?: string | null
  media_type?: string | null
  thumbnail_url?: string | null
  duration?: number | null
  format?: string | null
}

export type PetMedia = {
  id: string
  pet_id?: string
  media_asset_id?: string
  media_type?: 'image' | 'video' | string
  title?: string | null
  alt_text?: string | null
  caption?: string | null
  is_featured?: boolean
  sort_order?: number | null
  created_at?: string
  updated_at?: string
  media_assets?: PetMediaAsset | null
}

export type PetWithLegacyMedia = {
  id?: string
  name?: string
  breed?: string
  location?: string
  image_ids?: string[]
  featured_image_id?: string | null
  media?: PetMediaAsset | null
  media_items?: PetMedia[]
}

function resolveAsset(media?: PetMedia | PetMediaAsset | null): PetMediaAsset | null | undefined {
  return media && 'media_assets' in media ? media.media_assets : media
}

export function mediaKind(media?: PetMedia | PetMediaAsset | null) {
  const asset = resolveAsset(media)
  const rowMediaType = media && 'media_assets' in media ? media.media_type : undefined
  const raw = String(rowMediaType || asset?.media_type || asset?.resource_type || '').toLowerCase()
  return raw === 'video' ? 'video' : 'image'
}

export function cloudinaryVideoPoster(url?: string | null) {
  if (!url) return ''
  return url
    .replace('/video/upload/', '/video/upload/so_0,f_jpg/')
    .replace(/\.(mp4|mov|webm)(\?.*)?$/i, '.jpg$2')
}

export function petMediaUrl(media?: PetMedia | PetMediaAsset | null) {
  const asset = resolveAsset(media)
  return asset?.secure_url || ''
}

export function petMediaPoster(media?: PetMedia | PetMediaAsset | null) {
  const asset = resolveAsset(media)
  return asset?.thumbnail_url || (mediaKind(media) === 'video' ? cloudinaryVideoPoster(asset?.secure_url) : asset?.secure_url) || ''
}

export function petMediaAlt(pet: PetWithLegacyMedia, media?: PetMedia | PetMediaAsset | null) {
  const asset = resolveAsset(media)
  const specific = media && 'alt_text' in media ? media.alt_text : undefined
  return specific || asset?.alt_text || [pet.name, pet.breed, pet.location].filter(Boolean).join(' ') || 'Way2Pets pet listing image'
}

export function sortPetMedia(items: PetMedia[]) {
  return [...items].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
    const kindA = mediaKind(a) === 'image' ? 0 : 1
    const kindB = mediaKind(b) === 'image' ? 0 : 1
    if (kindA !== kindB) return kindA - kindB
    return Number(a.sort_order || 0) - Number(b.sort_order || 0)
  })
}

export function pickPetThumbnail(pet: PetWithLegacyMedia) {
  const media = sortPetMedia(pet.media_items || [])
  return media.find((item) => item.is_featured && mediaKind(item) === 'image')
    || media.find((item) => mediaKind(item) === 'image')
    || media.find((item) => mediaKind(item) === 'video')
    || (pet.media ? { id: String(pet.featured_image_id || pet.media.id || 'legacy'), media_type: mediaKind(pet.media), media_assets: pet.media } as PetMedia : null)
}

export async function fetchPetMedia(petIds: string[], serviceRole = false) {
  const ids = petIds.filter(Boolean)
  if (!ids.length) return new Map<string, PetMedia[]>()
  const map = new Map<string, PetMedia[]>()
  try {
    const rows = await getRows<PetMedia>(`pet_media?pet_id=in.(${ids.join(',')})&select=*,media_assets(*)&order=sort_order.asc`, serviceRole) || []
    for (const row of rows) {
      const key = String(row.pet_id || '')
      if (!key) continue
      map.set(key, [...(map.get(key) || []), row])
    }
  } catch (error) {
    console.warn('pet_media query failed; falling back to legacy pet image_ids.', error)
  }
  return map
}

export async function attachPetMedia<T extends PetWithLegacyMedia>(pets: T[], serviceRole = false): Promise<T[]> {
  const mediaMap = await fetchPetMedia(pets.map((pet) => String(pet.id || '')).filter(Boolean), serviceRole)
  const legacyIds = pets.flatMap((pet) => [pet.featured_image_id, ...(Array.isArray(pet.image_ids) ? pet.image_ids : [])]).filter(Boolean).map(String)
  let legacyMap = new Map<string, PetMediaAsset>()
  if (legacyIds.length) {
    try {
      const rows = await getRows<PetMediaAsset>(`media_assets?id=in.(${[...new Set(legacyIds)].join(',')})&select=*`, serviceRole) || []
      legacyMap = new Map(rows.map((row) => [String(row.id), row]))
    } catch (error) {
      console.warn('Legacy pet media lookup failed.', error)
    }
  }
  return pets.map((pet) => {
    const items = mediaMap.get(String(pet.id || '')) || []
    const legacyMedia = pet.featured_image_id ? legacyMap.get(String(pet.featured_image_id)) : Array.isArray(pet.image_ids) ? legacyMap.get(String(pet.image_ids[0])) : undefined
    return { ...pet, media_items: items, media: pickPetThumbnail({ ...pet, media_items: items, media: legacyMedia })?.media_assets || legacyMedia || null }
  })
}
