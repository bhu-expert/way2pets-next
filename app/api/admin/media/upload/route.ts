import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName } from '@/lib/admin'
import { signCloudinaryParams } from '@/lib/cloudinary'
import { handleGalleryUpload, type CloudinaryUpload } from '@/lib/gallery-upload'
import { deleteRows, getAuthUser, insertRow, isAllowedAdmin } from '@/lib/supabase'

async function uploadToCloudinary(file: File, category: string): Promise<CloudinaryUpload> {
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
    throw new Error(`Cloudinary upload failed with ${upload.status}: ${text}`)
  }

  return await upload.json() as CloudinaryUpload
}

export async function POST(req: NextRequest) {
  const result = await handleGalleryUpload(req, {
    adminCookieName,
    getAuthUser,
    isAllowedAdmin,
    uploadToCloudinary,
    insertRow: (table, body) => insertRow(table, body, true),
    deleteRows: (tableWithFilter) => deleteRows(tableWithFilter, true),
    logger: console,
  })

  if (result.body.success) {
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
  }

  return NextResponse.json(result.body, { status: result.status })
}
