require('./helpers.cjs')
const fs = require('node:fs')
const test = require('node:test')
const assert = require('node:assert/strict')
const { buildBlogPath } = require('../lib/taxonomy.ts')
const { validateBoarding, validateContact, validatePetRegistration } = require('../lib/validation.ts')
const { isAllowedAdmin } = require('../lib/supabase.ts')

test('contact form validation requires valid name, mobile, and topic', () => {
  assert.equal(validateContact({ name: '', mobile: '123', topic: '' }).ok, false)
  const valid = validateContact({ name: 'Pet Parent', mobile: '+919876543210', topic: 'Boarding', message: 'Need help' })
  assert.equal(valid.ok, true)
})

test('boarding date validation rejects checkout before checkin', () => {
  const invalid = validateBoarding({ ownerName: 'Pet Parent', contact: '+919876543210', petName: 'Bruno', checkIn: '2026-06-10', checkOut: '2026-06-09', foodPreference: 'Home food' })
  assert.equal(invalid.ok, false)
  assert.match(invalid.message, /after check-in/)
})

test('pet registration validates required owner, mobile, pet type, and pet name fields', () => {
  assert.equal(validatePetRegistration({ ownerName: '', mobile: '', petType: '', petName: '' }).ok, false)
  assert.equal(validatePetRegistration({ ownerName: 'Pet Parent', mobile: '+919876543210', petType: 'dog', petName: 'Bruno' }).ok, true)
})

test('admin helper allows ADMIN_EMAIL and rejects other user', () => {
  const old = process.env.ADMIN_EMAIL
  process.env.ADMIN_EMAIL = 'admin@example.com'
  assert.equal(isAllowedAdmin('admin@example.com'), true)
  assert.equal(isAllowedAdmin('user@example.com'), false)
  if (old === undefined) delete process.env.ADMIN_EMAIL
  else process.env.ADMIN_EMAIL = old
})

test('/admin/login is public and protected admin routes require login in proxy source', () => {
  const source = fs.readFileSync('proxy.ts', 'utf8')
  assert.match(source, /pathname === adminLoginPath/)
  assert.match(source, /NextResponse\.next\(\)/)
  assert.match(source, /pathname === '\/admin'/)
  assert.match(source, /NextResponse\.redirect/)
})

test('blog path generation creates taxonomy URLs', () => {
  assert.equal(buildBlogPath('dogs', 'breeds', 'top-10-dog-breeds-in-india'), '/dogs/breeds/top-10-dog-breeds-in-india')
  assert.equal(buildBlogPath('cats', 'boarding', 'best-cat-boarding-in-lucknow'), '/cats/boarding/best-cat-boarding-in-lucknow')
  assert.equal(buildBlogPath('general', 'pet-care', 'how-to-choose-a-pet'), '/blog/how-to-choose-a-pet')
})
