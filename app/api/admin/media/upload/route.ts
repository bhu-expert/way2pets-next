import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName } from '@/lib/admin'
import { uploadMediaToCloudinary } from '@/lib/cloudinary-upload'
import { handleGalleryUpload, type CloudinaryUpload } from '@/lib/gallery-upload'
import { deleteRows, getAuthUser, insertRow, isAllowedAdmin } from '@/lib/supabase'

async function uploadToCloudinary(file: File, category: string): Promise<CloudinaryUpload> {
  return uploadMediaToCloudinary(file, category)
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
