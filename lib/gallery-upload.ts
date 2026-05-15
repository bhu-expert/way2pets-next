import { galleryCategories, toPetType } from './taxonomy'

export type AuthUser = { id: string; email?: string }
export type CloudinaryUpload = {
  public_id: string
  secure_url: string
  width?: number
  height?: number
  format?: string
  resource_type?: string
  bytes?: number
}
export type GalleryUploadDeps = {
  adminCookieName: string
  getAuthUser: (token?: string) => Promise<AuthUser | null>
  isAllowedAdmin: (email?: string | null) => boolean
  uploadToCloudinary: (file: File, category: string) => Promise<CloudinaryUpload>
  insertRow: <T>(table: string, body: Record<string, unknown>) => Promise<T[] | null>
  deleteRows?: (tableWithFilter: string) => Promise<unknown>
  logger?: Pick<Console, 'error'>
}
export type GalleryUploadResult = { status: number; body: Record<string, unknown> }

export class GalleryUploadError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status = 500, details?: unknown) {
    super(message)
    this.name = 'GalleryUploadError'
    this.status = status
    this.details = details
  }
}

function boolFromForm(formData: FormData, names: string[], defaultValue: boolean) {
  for (const name of names) {
    if (!formData.has(name)) continue
    const value = String(formData.get(name) || '').toLowerCase()
    if (['on', 'true', '1', 'yes'].includes(value)) return true
    if (['off', 'false', '0', 'no', ''].includes(value)) return false
  }
  return defaultValue
}

function textFromForm(formData: FormData, ...names: string[]) {
  for (const name of names) {
    const value = String(formData.get(name) || '').trim()
    if (value) return value
  }
  return ''
}

export function getMissingCloudinaryEnv(env: NodeJS.ProcessEnv = process.env) {
  return ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter((key) => !env[key])
}

export function normalizeGalleryForm(formData: FormData) {
  const rawCategory = textFromForm(formData, 'category') || 'gallery'
  const category = [...galleryCategories, 'gallery', 'pets', 'website'].includes(rawCategory) ? rawCategory : 'gallery'
  const subcategory = textFromForm(formData, 'subcategory')
  const sortOrder = Number(textFromForm(formData, 'sortOrder', 'sort_order') || 0)
  return {
    category,
    title: textFromForm(formData, 'title'),
    altText: textFromForm(formData, 'altText', 'alt_text'),
    caption: textFromForm(formData, 'caption'),
    subcategory,
    createGallery: String(formData.get('createGallery') || '').toLowerCase() === 'true',
    petType: textFromForm(formData, 'petType', 'pet_type') || toPetType(category),
    isFeatured: boolFromForm(formData, ['isFeatured', 'is_featured'], false),
    isVisible: boolFromForm(formData, ['isVisible', 'is_visible'], true),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  }
}

export function buildMediaAssetPayload(uploaded: CloudinaryUpload, form: ReturnType<typeof normalizeGalleryForm>, userId: string) {
  return {
    provider: 'cloudinary',
    category: form.category,
    public_id: uploaded.public_id,
    secure_url: uploaded.secure_url,
    width: uploaded.width ?? null,
    height: uploaded.height ?? null,
    format: uploaded.format ?? null,
    resource_type: uploaded.resource_type || 'image',
    bytes: uploaded.bytes ?? null,
    alt_text: form.altText || null,
    title: form.title || null,
    caption: form.caption || null,
    uploaded_by: userId,
  }
}

export function buildGalleryImagePayload(assetId: string, form: ReturnType<typeof normalizeGalleryForm>) {
  return {
    media_asset_id: assetId,
    title: form.title || null,
    alt_text: form.altText || null,
    caption: form.caption || null,
    category: form.category,
    subcategory: form.subcategory || null,
    pet_type: form.petType,
    is_visible: form.isVisible,
    is_featured: form.isFeatured,
    sort_order: form.sortOrder,
  }
}

export function readableSupabaseDetails(error: unknown, table: string, payload?: Record<string, unknown>) {
  const base = {
    table,
    payloadKeys: payload ? Object.keys(payload).sort() : [],
    media_asset_id: payload?.media_asset_id ? String(payload.media_asset_id) : undefined,
  }
  if (error && typeof error === 'object') {
    const maybe = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown; status?: unknown; body?: unknown }
    return {
      ...base,
      message: String(maybe.message || 'Supabase request failed.'),
      code: maybe.code,
      details: maybe.details,
      hint: maybe.hint,
      status: maybe.status,
      body: maybe.body,
    }
  }
  return { ...base, message: String(error) }
}


function success(body: Record<string, unknown>, status = 200): GalleryUploadResult {
  return { status, body: { success: true, ...body } }
}

function failure(message: string, status: number, details?: unknown): GalleryUploadResult {
  return { status, body: { success: false, message, details } }
}

function supabaseErrorText(details: { code?: unknown; message?: unknown; details?: unknown; hint?: unknown }) {
  return [
    details.code ? `code ${String(details.code)}` : '',
    details.message ? String(details.message) : '',
    details.details ? `details: ${String(details.details)}` : '',
    details.hint ? `hint: ${String(details.hint)}` : '',
  ].filter(Boolean).join(' | ') || 'unknown Supabase error'
}

export async function handleGalleryUpload(req: Request & { cookies?: { get: (name: string) => { value?: string } | undefined } }, deps: GalleryUploadDeps): Promise<GalleryUploadResult> {
  const logger = deps.logger || console
  const token = req.cookies?.get(deps.adminCookieName)?.value
  const user = await deps.getAuthUser(token)

  if (!token || !user || !deps.isAllowedAdmin(user.email)) {
    logger.error('Gallery upload auth/admin check failed.', { hasToken: Boolean(token), userEmail: user?.email || null })
    return failure('Unauthorized admin. Please log in again before uploading.', 401)
  }

  const missing = getMissingCloudinaryEnv()
  if (missing.length > 0) {
    logger.error('Gallery upload missing Cloudinary environment variables.', { missing })
    return failure(`Missing Cloudinary env variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`, 500, { missing })
  }

  const formData = await req.formData()
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) return failure('Image file is required.', 400)

  const form = normalizeGalleryForm(formData)
  let uploaded: CloudinaryUpload
  try {
    uploaded = await deps.uploadToCloudinary(file, form.category)
  } catch (error) {
    logger.error('Gallery Cloudinary upload failed.', error)
    return failure('Cloudinary upload failed.', 502, error instanceof Error ? error.message : String(error))
  }

  let mediaRows: Record<string, unknown>[] | null
  const mediaPayload = buildMediaAssetPayload(uploaded, form, user.id)
  try {
    mediaRows = await deps.insertRow<Record<string, unknown>>('media_assets', mediaPayload)
  } catch (error) {
    const details = readableSupabaseDetails(error, 'media_assets', mediaPayload)
    logger.error('Gallery media_assets insert failed.', details)
    return failure('media_assets insert failed.', 500, details)
  }

  const asset = mediaRows?.[0]
  const assetId = asset?.id ? String(asset.id) : ''
  if (!assetId) {
    const details = { table: 'media_assets', message: 'Supabase media_assets insert did not return an id.', payloadKeys: Object.keys(mediaPayload).sort(), mediaRows }
    logger.error('Gallery media_assets insert returned no id.', details)
    return failure('Missing media_asset_id after media_assets insert.', 500, details)
  }

  let gallery: Record<string, unknown> | null = null
  if (form.createGallery) {
    const galleryPayload = buildGalleryImagePayload(assetId, form)
    try {
      const galleryRows = await deps.insertRow<Record<string, unknown>>('gallery_images', galleryPayload)
      gallery = galleryRows?.[0] || null
    } catch (error) {
      const details = readableSupabaseDetails(error, 'gallery_images', galleryPayload)
      logger.error('Gallery gallery_images insert failed.', details)

      if (deps.deleteRows) {
        try {
          await deps.deleteRows(`media_assets?id=eq.${encodeURIComponent(assetId)}`)
          logger.error('Deleted orphan media_assets row after gallery_images insert failure.', { media_asset_id: assetId })
        } catch (cleanupError) {
          logger.error('Failed to delete orphan media_assets row after gallery_images insert failure.', readableSupabaseDetails(cleanupError, 'media_assets', { id: assetId }))
        }
      }

      return failure(`media_assets created but gallery_images insert failed: ${supabaseErrorText(details)}`, 500, details)
    }
  }

  return success({ asset, gallery })
}
