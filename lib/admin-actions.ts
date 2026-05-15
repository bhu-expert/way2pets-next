'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from './admin'
import { deleteRow, resources, type FieldConfig } from './cms'
import { sanitizeHtml } from './html'
import { buildBlogPath, toPetType } from './taxonomy'
import { importReviewRows } from './review-bulk-import'
import { deleteRows, getRows, insertRow, updateRows } from './supabase'
import { getMissingCloudinaryEnv } from './gallery-upload'
import { uploadMediaToCloudinary } from './cloudinary-upload'

const allowedTables = new Set(Object.values(resources).map((resource) => resource.table))

function parseValue(field: FieldConfig, formData: FormData) {
  if (field.type === 'checkbox') return formData.get(field.name) === 'on'
  const raw = String(formData.get(field.name) || '').trim()
  if (!raw) return null
  if (field.type === 'number') return Number(raw)
  if (field.type === 'json') {
    try { return JSON.parse(raw) } catch { throw new Error(`${field.label} must be valid JSON.`) }
  }
  return raw
}

function findResource(resourceKey: string) {
  const resource = resources[resourceKey]
  if (!resource || !allowedTables.has(resource.table)) throw new Error('Invalid admin resource.')
  return resource
}

export async function saveCmsResource(formData: FormData) {
  await requireAdmin()
  const resourceKey = String(formData.get('_resource') || '')
  const id = String(formData.get('id') || '')
  const resource = findResource(resourceKey)
  const body: Record<string, unknown> = {}

  for (const field of resource.fields) {
    if (field.type === 'hidden') continue
    if (resourceKey === 'settings' && field.name === 'value_json') {
      const raw = String(formData.get(field.name) || '').trim()
      if (field.required && !raw) throw new Error(`${field.label} is required.`)
      if (formData.get('_value_json_mode') === 'json') {
        try { body[field.name] = raw ? JSON.parse(raw) : {} } catch { throw new Error(`${field.label} must be valid JSON.`) }
      } else {
        body[field.name] = { value: raw }
      }
      continue
    }
    const value = parseValue(field, formData)
    if (field.required && (value === null || value === '')) throw new Error(`${field.label} is required.`)
    if (value !== null || field.type === 'checkbox') body[field.name] = value
  }

  if (resource.table === 'gallery_images') {
    body.subcategory = String(formData.get('subcategory') || '').trim() || null
  }

  if (resource.table === 'blog_posts') {
    const category = String(body.category || 'general')
    const subcategory = String(body.subcategory || '')
    const slug = String(body.slug || '')
    body.pet_type = toPetType(category)
    body.full_path = body.full_path || buildBlogPath(category, subcategory, slug)
    if (typeof body.content_html === 'string') body.content_html = sanitizeHtml(body.content_html)
  }

  if (resource.table === 'pages' && typeof body.content_json === 'object' && body.content_json) {
    body.content_json = body.content_json
  }

  if (id) await updateRows(`${resource.table}?id=eq.${encodeURIComponent(id)}`, body)
  else await insertRow(resource.table, body)

  revalidatePath('/admin')
  if (resourceKey === 'blog') revalidatePath('/blog')
  if (resourceKey === 'gallery') revalidatePath('/gallery')
  if (resourceKey === 'pets') revalidatePath('/find-a-pet')
  if (resourceKey === 'reviews') revalidatePath('/reviews')
  redirect(resource.editPath || `/admin/${resourceKey}`)
}

export async function deleteCmsResource(formData: FormData) {
  await requireAdmin()
  const resourceKey = String(formData.get('_resource') || '')
  const id = String(formData.get('id') || '')
  const resource = findResource(resourceKey)
  if (!id) throw new Error('Record id is required.')
  await deleteRow(resource.table, id)
  revalidatePath('/admin')
  redirect(resource.editPath || `/admin/${resourceKey}`)
}

function slugifyPetName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formString(formData: FormData, key: string, fallback = '') {
  return String(formData.get(key) || fallback).trim()
}

async function refreshPetLegacyMediaFields(petId: string) {
  const media = await getRows<{ media_asset_id?: string; media_type?: string; is_featured?: boolean; sort_order?: number }>(
    `pet_media?pet_id=eq.${encodeURIComponent(petId)}&select=media_asset_id,media_type,is_featured,sort_order&order=sort_order.asc`,
    true,
  ) || []
  const imageIds = media.filter((item) => item.media_type !== 'video').map((item) => item.media_asset_id).filter(Boolean)
  const featuredImage = media.find((item) => item.is_featured && item.media_type !== 'video')?.media_asset_id || imageIds[0] || null
  await updateRows(`pets?id=eq.${encodeURIComponent(petId)}`, { image_ids: imageIds, featured_image_id: featuredImage })
}

async function ensureSingleFeaturedImage(petId: string, featuredMediaId?: string) {
  if (!featuredMediaId) return
  await updateRows(`pet_media?pet_id=eq.${encodeURIComponent(petId)}&media_type=eq.image`, { is_featured: false })
  await updateRows(`pet_media?id=eq.${encodeURIComponent(featuredMediaId)}&pet_id=eq.${encodeURIComponent(petId)}`, { is_featured: true })
}

async function uploadPetMediaFiles(petId: string, formData: FormData, userId: string) {
  const files = formData.getAll('media_files').filter((file): file is File => file instanceof File && file.size > 0)
  if (!files.length) return { uploaded: 0, errors: [] as string[] }
  const missing = getMissingCloudinaryEnv()
  if (missing.length) return { uploaded: 0, errors: [`Missing Cloudinary env variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`] }

  const existing = await getRows<{ id: string; media_type?: string; is_featured?: boolean; sort_order?: number }>(`pet_media?pet_id=eq.${encodeURIComponent(petId)}&select=id,media_type,is_featured,sort_order`, true) || []
  let nextSort = existing.reduce((max, item) => Math.max(max, Number(item.sort_order || 0)), -1) + 1
  let hasFeaturedImage = existing.some((item) => item.is_featured && item.media_type !== 'video')
  let uploaded = 0
  const errors: string[] = []

  for (const file of files) {
    try {
      const cloudinary = await uploadMediaToCloudinary(file, 'pets')
      const mediaType = cloudinary.media_type === 'video' || cloudinary.resource_type === 'video' ? 'video' : 'image'
      const title = formString(formData, 'new_media_title') || formString(formData, 'name') || file.name
      const altText = formString(formData, 'new_media_alt_text') || `${formString(formData, 'name', 'Way2Pets pet')} ${formString(formData, 'breed')} ${formString(formData, 'location')}`.trim()
      const caption = formString(formData, 'new_media_caption')
      const assetRows = await insertRow<{ id: string }>('media_assets', {
        provider: 'cloudinary',
        category: 'pets',
        public_id: cloudinary.public_id,
        secure_url: cloudinary.secure_url,
        width: cloudinary.width ?? null,
        height: cloudinary.height ?? null,
        format: cloudinary.format ?? null,
        resource_type: cloudinary.resource_type || mediaType,
        media_type: mediaType,
        duration: cloudinary.duration ?? null,
        thumbnail_url: cloudinary.thumbnail_url || null,
        bytes: cloudinary.bytes ?? null,
        alt_text: altText || null,
        title: title || null,
        caption: caption || null,
        uploaded_by: userId,
      }, true)
      const assetId = assetRows?.[0]?.id
      if (!assetId) throw new Error('media_assets insert did not return an id.')
      const makeFeatured = mediaType === 'image' && !hasFeaturedImage
      await insertRow('pet_media', {
        pet_id: petId,
        media_asset_id: assetId,
        media_type: mediaType,
        title: title || null,
        alt_text: altText || null,
        caption: caption || null,
        is_featured: makeFeatured,
        sort_order: nextSort,
      }, true)
      if (makeFeatured) hasFeaturedImage = true
      nextSort += 1
      uploaded += 1
    } catch (error) {
      errors.push(`${file.name}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return { uploaded, errors }
}

async function updateExistingPetMedia(petId: string, formData: FormData) {
  const ids = formData.getAll('pet_media_id').map((id) => String(id).trim()).filter(Boolean)
  const selectedFeatured = formString(formData, 'featured_media_id')
  for (const mediaId of ids) {
    if (formData.get(`delete_media_${mediaId}`) === 'on') {
      await deleteRows(`pet_media?id=eq.${encodeURIComponent(mediaId)}&pet_id=eq.${encodeURIComponent(petId)}`, true)
      continue
    }
    await updateRows(`pet_media?id=eq.${encodeURIComponent(mediaId)}&pet_id=eq.${encodeURIComponent(petId)}`, {
      title: formString(formData, `media_title_${mediaId}`) || null,
      alt_text: formString(formData, `media_alt_text_${mediaId}`) || null,
      caption: formString(formData, `media_caption_${mediaId}`) || null,
      sort_order: Number(formString(formData, `media_sort_order_${mediaId}`) || 0),
    })
  }
  if (selectedFeatured) await ensureSingleFeaturedImage(petId, selectedFeatured)
}

export async function savePetWithImages(formData: FormData) {
  const admin = await requireAdmin()
  const id = String(formData.get('id') || '')
  const name = formString(formData, 'name')
  const slug = formString(formData, 'slug') || slugifyPetName(name)
  const listingType = formString(formData, 'listing_type', 'sale')
  const price = formData.get('price') ? Number(formData.get('price')) : null
  if (!name) throw new Error('Name is required.')
  if (!slug) throw new Error('Slug is required or name must be present to auto-generate it.')
  if (!formString(formData, 'pet_type')) throw new Error('Pet type is required.')
  if (!listingType) throw new Error('Listing type is required.')
  if (listingType === 'sale' && (price === null || Number.isNaN(price))) throw new Error('Price is required for sale listings.')

  const body: Record<string, unknown> = {
    name,
    slug,
    pet_type: formString(formData, 'pet_type', 'dog'),
    subcategory: formString(formData, 'subcategory'),
    listing_type: listingType,
    breed: formString(formData, 'breed'),
    age: formString(formData, 'age'),
    gender: formString(formData, 'gender', 'unknown'),
    price,
    location: formString(formData, 'location', 'Lucknow'),
    vaccination_status: formString(formData, 'vaccination_status'),
    temperament: formString(formData, 'temperament'),
    health_notes: formString(formData, 'health_notes'),
    description: formString(formData, 'description'),
    availability_status: formString(formData, 'availability_status', 'available'),
    status: formString(formData, 'status', 'published'),
    owner_email: formString(formData, 'owner_email') || null,
    user_id: formString(formData, 'user_id') || null,
    editable_by_user: formData.get('editable_by_user') === 'on',
    meta_title: formString(formData, 'meta_title'),
    meta_description: formString(formData, 'meta_description'),
  }

  let petId = id
  if (petId) {
    await updateRows(`pets?id=eq.${encodeURIComponent(petId)}`, body)
  } else {
    const inserted = await insertRow<{ id: string }>('pets', body)
    petId = inserted?.[0]?.id || ''
    if (!petId) throw new Error('Pet saved, but Supabase did not return a pet id.')
  }

  await updateExistingPetMedia(petId, formData)
  const uploadResult = await uploadPetMediaFiles(petId, formData, admin.id)
  await refreshPetLegacyMediaFields(petId)

  revalidatePath('/find-a-pet')
  revalidatePath('/admin/pets')
  revalidatePath(`/admin/pets/${petId}`)
  revalidatePath(`/pets/${slug}`)

  if (uploadResult.errors.length) {
    redirect(`/admin/pets/${petId}?media_error=${encodeURIComponent(`Pet saved. ${uploadResult.uploaded} media uploaded. Failed: ${uploadResult.errors.join('; ')}`)}`)
  }
  redirect('/admin/pets')
}

export async function bulkImportReviews(rows: Array<Record<string, string>>) {
  await requireAdmin()
  const result = await importReviewRows(rows, 'server-action')
  revalidatePath('/admin/reviews')
  revalidatePath('/reviews')
  revalidatePath('/')
  return result
}

export async function saveWebsiteContent(formData: FormData) {
  await requireAdmin()
  const { upsertRows } = await import('./supabase')
  const rawSections = String(formData.get('sections') || '[]')
  const rawItems = String(formData.get('items') || '[]')
  const sections = JSON.parse(rawSections) as Record<string, unknown>[]
  const items = JSON.parse(rawItems) as Record<string, unknown>[]
  if (!Array.isArray(sections) || !Array.isArray(items)) throw new Error('Invalid website content payload.')

  const normalize = (row: Record<string, unknown>) => ({
    ...row,
    section_key: String(row.section_key || '').trim(),
    sort_order: Number(row.sort_order || 0),
    is_active: row.is_active !== false,
    metadata_json: row.metadata_json && typeof row.metadata_json === 'object' ? row.metadata_json : {},
  })
  const cleanSections = sections.map(normalize).filter((row) => row.section_key)
  const cleanItems = items.map((row) => ({ ...normalize(row), item_key: String(row.item_key || '').trim() })).filter((row) => row.section_key && row.item_key)

  if (cleanSections.length) await upsertRows('website_sections?on_conflict=section_key', cleanSections)
  if (cleanItems.length) await upsertRows('website_section_items?on_conflict=section_key,item_key', cleanItems)

  revalidatePath('/')
  revalidatePath('/admin/website-content')
  revalidatePath('/admin')
  redirect('/admin/website-content?saved=1')
}
