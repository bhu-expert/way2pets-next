'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from './admin'
import { deleteRow, resources, type FieldConfig } from './cms'
import { sanitizeHtml } from './html'
import { buildBlogPath, toPetType } from './taxonomy'
import { insertRow, updateRows } from './supabase'

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
    const value = parseValue(field, formData)
    if (field.required && (value === null || value === '')) throw new Error(`${field.label} is required.`)
    if (value !== null || field.type === 'checkbox') body[field.name] = value
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

export async function savePetWithImages(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const imageIds = String(formData.get('image_ids') || '').split(',').map((item) => item.trim()).filter(Boolean)
  const body: Record<string, unknown> = {
    name: String(formData.get('name') || '').trim(),
    slug: String(formData.get('slug') || '').trim(),
    pet_type: String(formData.get('pet_type') || 'dog'),
    subcategory: String(formData.get('subcategory') || ''),
    listing_type: String(formData.get('listing_type') || 'sale'),
    breed: String(formData.get('breed') || ''),
    age: String(formData.get('age') || ''),
    gender: String(formData.get('gender') || 'unknown'),
    price: formData.get('price') ? Number(formData.get('price')) : null,
    location: String(formData.get('location') || 'Lucknow'),
    vaccination_status: String(formData.get('vaccination_status') || ''),
    temperament: String(formData.get('temperament') || ''),
    health_notes: String(formData.get('health_notes') || ''),
    description: String(formData.get('description') || ''),
    image_ids: imageIds,
    featured_image_id: imageIds[0] || null,
    availability_status: String(formData.get('availability_status') || 'available'),
    status: String(formData.get('status') || 'published'),
    meta_title: String(formData.get('meta_title') || ''),
    meta_description: String(formData.get('meta_description') || ''),
  }
  if (!body.name || !body.slug) throw new Error('Name and slug are required.')
  if (id) await updateRows(`pets?id=eq.${encodeURIComponent(id)}`, body)
  else await insertRow('pets', body)
  revalidatePath('/find-a-pet')
  revalidatePath('/admin/pets')
  redirect('/admin/pets')
}

export async function bulkImportReviews(rows: Array<Record<string, string>>) {
  await requireAdmin()
  const valid: Record<string, unknown>[] = []
  const errors: string[] = []
  rows.forEach((row, index) => {
    const reviewer_name = row.reviewer_name?.trim()
    const rating = Number(row.rating)
    const review_text = row.review_text?.trim()
    if (!reviewer_name) errors.push(`Row ${index + 1}: reviewer_name is required.`)
    if (!rating || rating < 1 || rating > 5) errors.push(`Row ${index + 1}: rating must be 1-5.`)
    if (!review_text) errors.push(`Row ${index + 1}: review_text is required.`)
    if (reviewer_name && rating >= 1 && rating <= 5 && review_text) valid.push({ reviewer_name, rating, review_text, source: row.source || 'Manual', source_url: row.source_url || null, reviewed_at: row.reviewed_at || null, status: row.status || 'published', is_featured: ['true', '1', 'yes', 'on'].includes(String(row.is_featured || '').toLowerCase()) })
  })
  if (valid.length) await insertRow('reviews', valid)
  revalidatePath('/admin/reviews')
  revalidatePath('/reviews')
  return { imported: valid.length, failed: errors.length, errors }
}
