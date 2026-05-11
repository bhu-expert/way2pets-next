'use client'

import Image from 'next/image'
import { useState } from 'react'
import { galleryCategories } from '@/lib/taxonomy'

type UploadAsset = { id?: string; secure_url?: string; width?: number; height?: number; title?: string }

export default function GalleryUpload() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [asset, setAsset] = useState<UploadAsset | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('Uploading to Cloudinary and saving gallery item...')
    const form = event.currentTarget
    try {
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: new FormData(form), credentials: 'same-origin' })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Upload failed')
      setAsset(json.asset)
      setMessage('Saved. The image is now available in Gallery Manager and the public gallery when visible is checked.')
      form.reset()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="admin-panel admin-upload-form">
      <h2>Add gallery image</h2>
      <p>Upload happens server-side. Cloudinary API secret and Supabase service role are never exposed to the browser.</p>
      <input type="hidden" name="createGallery" value="true" />
      <label><span>Choose image file *</span><input type="file" name="file" accept="image/*" required /></label>
      <label><span>Title</span><input name="title" placeholder="Dog Boarding in Lucknow" /></label>
      <label><span>Caption</span><textarea name="caption" placeholder="Safe home-style dog boarding at Way2Pets" rows={3} /></label>
      <label><span>Alt text</span><input name="altText" placeholder="Dog boarding in Lucknow at Way2Pets" /></label>
      <label><span>Category</span><select name="category" defaultValue="boarding">{galleryCategories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Subcategory</span><input name="subcategory" placeholder="Optional" /></label>
      <label><span>Sort order</span><input name="sortOrder" type="number" defaultValue="0" /></label>
      <label><input type="checkbox" name="isVisible" value="true" defaultChecked /> Visible</label>
      <label><input type="checkbox" name="isFeatured" /> Featured</label>
      <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save gallery image'}</button>
      {message && <p>{message}</p>}
      {asset?.secure_url && <Image src={asset.secure_url} alt={asset.title || 'Uploaded gallery image'} width={asset.width || 320} height={asset.height || 220} style={{ maxWidth: '320px', height: 'auto', borderRadius: 12 }} />}
    </form>
  )
}
