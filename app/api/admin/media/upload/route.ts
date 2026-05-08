import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, insertRow, isAllowedAdmin } from '@/lib/supabase'
import { adminCookieName } from '@/lib/admin'
import { hasCloudinaryConfig, signCloudinaryParams } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(adminCookieName)?.value
  const user = await getAuthUser(token)

  if (!user || !isAllowedAdmin(user.email)) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json({ success: false, message: 'Cloudinary is not configured.' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file')
  const category = String(formData.get('category') || 'gallery')
  const title = String(formData.get('title') || '')
  const altText = String(formData.get('altText') || '')
  const caption = String(formData.get('caption') || '')

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: 'Image file is required.' }, { status: 400 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = `way2pets/${category}`
  const signature = signCloudinaryParams({ folder, timestamp })
  const uploadData = new FormData()
  uploadData.append('file', file)
  uploadData.append('api_key', process.env.CLOUDINARY_API_KEY || '')
  uploadData.append('timestamp', String(timestamp))
  uploadData.append('folder', folder)
  uploadData.append('signature', signature)

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: uploadData,
  })

  if (!upload.ok) {
    return NextResponse.json({ success: false, message: 'Cloudinary upload failed.' }, { status: 502 })
  }

  const uploaded = await upload.json() as {
    public_id: string
    secure_url: string
    width?: number
    height?: number
    format?: string
    resource_type?: string
    bytes?: number
  }

  const rows = await insertRow('media_assets', {
    provider: 'cloudinary',
    category,
    public_id: uploaded.public_id,
    secure_url: uploaded.secure_url,
    width: uploaded.width,
    height: uploaded.height,
    format: uploaded.format,
    resource_type: uploaded.resource_type || 'image',
    bytes: uploaded.bytes,
    alt_text: altText,
    title,
    caption,
    uploaded_by: user.id,
  })

  return NextResponse.json({ success: true, asset: rows?.[0] || uploaded })
}
