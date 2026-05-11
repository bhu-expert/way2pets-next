'use client'

import { useState } from 'react'

export default function GalleryUpload() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('Uploading...')
    const form = event.currentTarget
    try {
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: new FormData(form) })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Upload failed')
      setMessage('Image uploaded and saved. Refresh to see it in the table.')
      form.reset()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="admin-panel admin-upload-form">
      <h2>Upload image to Cloudinary</h2>
      <input type="hidden" name="createGallery" value="true" />
      <input type="file" name="file" accept="image/*" required />
      <input name="title" placeholder="Title" />
      <input name="altText" placeholder="Alt text" />
      <input name="caption" placeholder="Caption" />
      <select name="category" defaultValue="gallery">
        {['boarding', 'grooming', 'puppies', 'kittens', 'happy-pets', 'facility', 'reviews', 'blog', 'hero', 'gallery'].map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select name="petType" defaultValue="general"><option>general</option><option>dog</option><option>cat</option><option>both</option></select>
      <label><input type="checkbox" name="isFeatured" /> Featured</label>
      <button type="submit" disabled={busy}>{busy ? 'Uploading...' : 'Upload image'}</button>
      {message && <p>{message}</p>}
    </form>
  )
}
