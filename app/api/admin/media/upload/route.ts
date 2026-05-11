import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName } from '@/lib/admin'
import { hasCloudinaryConfig, signCloudinaryParams } from '@/lib/cloudinary'
import { galleryCategories } from '@/lib/taxonomy'
import { getAuthUser, insertRow, isAllowedAdmin } from '@/lib/supabase'

function json(message: string, status: number, details?: unknown) {
  return NextResponse.json({ success: false, message, details }, { status })
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(adminCookieName)?.value
  const user = await getAuthUser(token)

  if (!token || !user || !isAllowedAdmin(user.email)) {
    return json('Unauthorized admin. Please log in again before uploading.', 401)
  }

  const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter((key) => !process.env[key])
  if (!hasCloudinaryConfig() || missing.length > 0) {
    return json(`Missing Cloudinary env variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`, 500)
  }

  const formData = await req.formData()
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return json('Image file is required.', 400)
  }

  const rawCategory = String(formData.get('category') || 'gallery')
  const category = [...galleryCategories, 'pets'].includes(rawCategory) ? rawCategory : 'gallery'
  const title = String(formData.get('title') || '')
  const altText = String(formData.get('altText') || formData.get('alt_text') || '')
  const caption = String(formData.get('caption') || '')
  const subcategory = String(formData.get('subcategory') || '')
  const createGallery = String(formData.get('createGallery') || '') === 'true'
  const petType = String(formData.get('petType') || formData.get('pet_type') || (category === 'dogs' ? 'dog' : category === 'cats' ? 'cat' : 'general'))
  const isFeatured = ['on', 'true', '1'].includes(String(formData.get('isFeatured') || formData.get('is_featured') || ''))
  const isVisible = !['false', '0'].includes(String(formData.get('isVisible') || formData.get('is_visible') || 'true'))
  const sortOrder = Number(formData.get('sortOrder') || formData.get('sort_order') || 0)

  const timestamp = Math.round(Date.now() / 1000)
  const folder = `way2pets/${category}`
  const signature = signCloudinaryParams({ folder, timestamp })
  const uploadData = new FormData()
  uploadData.append('file', file)
  uploadData.append('api_key', process.env.CLOUDINARY_API_KEY || '')
  uploadData.append('timestamp', String(timestamp))
  uploadData.append('folder', folder)
  uploadData.append('signature', signature)

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: uploadData })
  if (!upload.ok) {
    const text = await upload.text()
    return json('Cloudinary upload failed.', 502, text)
  }

  const uploaded = await upload.json() as { public_id: string; secure_url: string; width?: number; height?: number; format?: string; resource_type?: string; bytes?: number }

  let rows
  try {
    rows = await insertRow<Record<string, unknown>>('media_assets', {
      provider: 'cloudinary', category, public_id: uploaded.public_id, secure_url: uploaded.secure_url,
      width: uploaded.width, height: uploaded.height, format: uploaded.format, resource_type: uploaded.resource_type || 'image', bytes: uploaded.bytes,
      alt_text: altText, title, caption, uploaded_by: user.id,
    })
  } catch (error) {
    return json('Supabase insert failed while saving media metadata.', 500, error instanceof Error ? error.message : String(error))
  }

  const asset = rows?.[0] || uploaded
  const assetId = typeof asset === 'object' && asset !== null && 'id' in asset ? String(asset.id) : ''

  if (createGallery && assetId) {
    try {
      await insertRow('gallery_images', { media_asset_id: assetId, title, alt_text: altText, caption, category, subcategory: subcategory || null, pet_type: petType, is_visible: isVisible, is_featured: isFeatured, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 })
    } catch (error) {
      return json('Supabase insert failed while saving gallery image.', 500, error instanceof Error ? error.message : String(error))
    }
  }

  return NextResponse.json({ success: true, asset })
}
