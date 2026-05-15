import { signCloudinaryParams } from './cloudinary'
import type { CloudinaryUpload } from './gallery-upload'
import { cloudinaryVideoPoster } from './pet-media'

const imageTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
])
const videoTypes = new Map([
  ['video/mp4', 'mp4'],
  ['video/quicktime', 'mov'],
  ['video/webm', 'webm'],
])
const maxImageBytes = 12 * 1024 * 1024
const maxVideoBytes = 120 * 1024 * 1024

export type ValidatedMediaFile = { mediaType: 'image' | 'video'; resourceType: 'image' | 'video'; extension: string }

export function validateMediaFile(file: File): ValidatedMediaFile {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  const imageExtension = imageTypes.get(type) || (name.match(/\.(jpe?g|png|webp|avif)$/)?.[1]?.replace('jpeg', 'jpg'))
  if (imageExtension) {
    if (file.size > maxImageBytes) throw new Error('Image is too large. Please upload an image up to 12 MB.')
    return { mediaType: 'image', resourceType: 'image', extension: imageExtension }
  }
  const videoExtension = videoTypes.get(type) || name.match(/\.(mp4|mov|webm)$/)?.[1]
  if (videoExtension) {
    if (file.size > maxVideoBytes) throw new Error('Video is too large. Please upload a video up to 120 MB.')
    return { mediaType: 'video', resourceType: 'video', extension: videoExtension }
  }
  throw new Error('Unsupported media type. Upload JPG, PNG, WEBP, AVIF, MP4, MOV, or WEBM files.')
}

export async function uploadMediaToCloudinary(file: File, category: string): Promise<CloudinaryUpload> {
  const validation = validateMediaFile(file)
  const timestamp = Math.round(Date.now() / 1000)
  const folder = `way2pets/${category}`
  const signature = signCloudinaryParams({ folder, timestamp })
  const uploadData = new FormData()
  uploadData.append('file', file)
  uploadData.append('api_key', process.env.CLOUDINARY_API_KEY || '')
  uploadData.append('timestamp', String(timestamp))
  uploadData.append('folder', folder)
  uploadData.append('signature', signature)

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${validation.resourceType}/upload`, { method: 'POST', body: uploadData })
  if (!upload.ok) {
    const text = await upload.text()
    throw new Error(`Cloudinary upload failed with ${upload.status}: ${text}`)
  }

  const json = await upload.json() as CloudinaryUpload & { duration?: number; thumbnail_url?: string }
  return {
    ...json,
    resource_type: validation.resourceType,
    media_type: validation.mediaType,
    thumbnail_url: json.thumbnail_url || (validation.mediaType === 'video' ? cloudinaryVideoPoster(json.secure_url) : json.secure_url),
  }
}
