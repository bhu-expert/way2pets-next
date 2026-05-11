'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from './admin'
import { deleteRow, resources, type FieldConfig } from './cms'
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

  if (resource.table === 'blog_posts' && !body.full_path && body.slug) {
    const petType = body.pet_type || 'general'
    body.full_path = petType === 'dog' ? `/dogs/general/${body.slug}` : petType === 'cat' ? `/cats/general/${body.slug}` : `/blog/${body.slug}`
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
