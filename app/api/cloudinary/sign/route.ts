import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName } from '@/lib/admin'
import { signCloudinaryParams } from '@/lib/cloudinary'
import { getAuthUser, isAllowedAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(adminCookieName)?.value
  const user = await getAuthUser(token)
  if (!user || !isAllowedAdmin(user.email)) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
  }

  const { folder = 'way2pets/gallery' } = await req.json()
  const timestamp = Math.round(Date.now() / 1000)
  const signature = signCloudinaryParams({ folder, timestamp })

  return NextResponse.json({
    success: true,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature,
  })
}
