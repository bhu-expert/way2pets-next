require('./helpers.cjs')
const test = require('node:test')
const assert = require('node:assert/strict')
const {
  buildGalleryImagePayload,
  buildMediaAssetPayload,
  handleGalleryUpload,
  normalizeGalleryForm,
} = require('../lib/gallery-upload.ts')

function withCloudinaryEnv(fn) {
  const old = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  }
  process.env.CLOUDINARY_CLOUD_NAME = 'demo'
  process.env.CLOUDINARY_API_KEY = 'key'
  process.env.CLOUDINARY_API_SECRET = 'secret'
  return Promise.resolve(fn()).finally(() => {
    for (const [key, value] of Object.entries(old)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })
}

function request(formData, token = 'token') {
  return {
    cookies: { get: () => token ? { value: token } : undefined },
    formData: async () => formData,
  }
}

function galleryForm() {
  const form = new FormData()
  form.set('file', new File(['image'], 'dog.jpg', { type: 'image/jpeg' }))
  form.set('createGallery', 'true')
  form.set('title', 'Dog Summer Fruits')
  form.set('caption', 'Dog fruits to eat in summer')
  form.set('altText', 'Dog fruits to eat in summer at Way2Pets')
  form.set('category', 'blog')
  form.set('subcategory', 'dog-health')
  form.set('isVisible', 'true')
  form.set('sortOrder', '0')
  return form
}

function deps(overrides = {}) {
  return {
    adminCookieName: 'w2p_admin_session',
    getAuthUser: async () => ({ id: 'user-1', email: 'admin@example.com' }),
    isAllowedAdmin: (email) => email === 'admin@example.com',
    uploadToCloudinary: async () => ({ public_id: 'way2pets/blog/dog', secure_url: 'https://res.cloudinary.com/demo/image/upload/dog.jpg', width: 900, height: 600, format: 'jpg', resource_type: 'image', bytes: 123 }),
    insertRow: async (table, body) => [{ id: table === 'media_assets' ? 'asset-1' : 'gallery-1', ...body }],
    logger: { error() {} },
    ...overrides,
  }
}

test('Gallery upload API rejects unauthenticated user', async () => withCloudinaryEnv(async () => {
  const result = await handleGalleryUpload(request(galleryForm(), ''), deps({ getAuthUser: async () => null }))
  assert.equal(result.status, 401)
  assert.match(result.body.message, /Unauthorized admin/)
}))

test('Gallery upload API rejects non-admin email', async () => withCloudinaryEnv(async () => {
  const result = await handleGalleryUpload(request(galleryForm()), deps({ getAuthUser: async () => ({ id: 'user-2', email: 'user@example.com' }) }))
  assert.equal(result.status, 401)
}))

test('Gallery upload API validates required file', async () => withCloudinaryEnv(async () => {
  const form = new FormData()
  form.set('createGallery', 'true')
  const result = await handleGalleryUpload(request(form), deps())
  assert.equal(result.status, 400)
  assert.equal(result.body.message, 'Image file is required.')
}))

test('Gallery upload API handles Cloudinary success and inserts media/gallery rows', async () => withCloudinaryEnv(async () => {
  const calls = []
  const result = await handleGalleryUpload(request(galleryForm()), deps({ insertRow: async (table, body) => { calls.push({ table, body }); return [{ id: table === 'media_assets' ? 'asset-1' : 'gallery-1', ...body }] } }))
  assert.equal(result.status, 200)
  assert.equal(calls[0].table, 'media_assets')
  assert.equal(calls[1].table, 'gallery_images')
  assert.equal(calls[1].body.media_asset_id, 'asset-1')
  assert.equal(calls[1].body.subcategory, 'dog-health')
  assert.equal(calls[1].body.pet_type, 'general')
}))

test('Gallery upload API handles media_assets insert failure', async () => withCloudinaryEnv(async () => {
  const result = await handleGalleryUpload(request(galleryForm()), deps({ insertRow: async (table) => { if (table === 'media_assets') throw Object.assign(new Error('column missing'), { code: '42703' }); return [] } }))
  assert.equal(result.status, 500)
  assert.equal(result.body.message, 'Media asset insert failed.')
  assert.equal(result.body.details.code, '42703')
}))

test('Gallery upload API handles gallery_images insert failure', async () => withCloudinaryEnv(async () => {
  const result = await handleGalleryUpload(request(galleryForm()), deps({ insertRow: async (table, body) => { if (table === 'gallery_images') throw Object.assign(new Error('violates foreign key'), { code: '23503' }); return [{ id: 'asset-1', ...body }] } }))
  assert.equal(result.status, 500)
  assert.equal(result.body.message, 'Gallery image insert failed.')
  assert.equal(result.body.details.code, '23503')
}))

test('Gallery payload builders map form fields without requiring manual media_asset_id', () => {
  const form = normalizeGalleryForm(galleryForm())
  const assetPayload = buildMediaAssetPayload({ public_id: 'p', secure_url: 'u' }, form, 'user-1')
  const galleryPayload = buildGalleryImagePayload('asset-1', form)
  assert.equal(assetPayload.uploaded_by, 'user-1')
  assert.equal(galleryPayload.media_asset_id, 'asset-1')
  assert.equal(Object.hasOwn(galleryPayload, 'manual_media_asset_id'), false)
})
