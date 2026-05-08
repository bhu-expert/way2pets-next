import crypto from 'crypto'

export function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
}

export function cloudinaryImageUrl(publicId: string, transforms = 'f_auto,q_auto,c_limit,w_1200') {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return ''
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

export function signCloudinaryParams(params: Record<string, string | number>) {
  const secret = process.env.CLOUDINARY_API_SECRET
  if (!secret) throw new Error('Cloudinary secret is not configured.')

  const payload = Object.entries(params)
    .filter(([, value]) => value !== '' && value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return crypto.createHash('sha1').update(`${payload}${secret}`).digest('hex')
}
