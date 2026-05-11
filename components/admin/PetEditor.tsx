'use client'

import Image from 'next/image'
import { useState } from 'react'
import { savePetWithImages } from '@/lib/admin-actions'
import type { CmsRow } from '@/lib/cms'

type Asset = { id?: string; secure_url?: string; width?: number; height?: number; alt_text?: string }

export default function PetEditor({ row }: { row: CmsRow | null }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [message, setMessage] = useState('')
  const existingIds = Array.isArray(row?.image_ids) ? row?.image_ids.map(String) : []
  const imageIds = [...existingIds, ...assets.map((asset) => asset.id).filter(Boolean)].join(',')

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    for (const file of files) {
      const data = new FormData()
      data.append('file', file)
      data.append('category', 'pets')
      data.append('title', String(row?.name || 'Pet listing image'))
      setMessage(`Uploading ${file.name}...`)
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: data, credentials: 'same-origin' })
      const json = await res.json()
      if (!res.ok || !json.success) { setMessage(json.message || 'Upload failed'); return }
      setAssets((current) => [...current, json.asset])
    }
    setMessage('Image upload complete. Save the pet to attach images.')
  }

  return (
    <div>
      <div className="admin-page-header"><div><h1>{row?.id ? 'Edit Pet' : 'New Pet'}</h1><p>Upload one or more pet images, mark the first image as featured, and manage full listing details.</p></div></div>
      <form action={savePetWithImages} className="admin-panel admin-form-grid">
        {row?.id && <input type="hidden" name="id" value={String(row.id)} />}
        <input type="hidden" name="image_ids" value={imageIds} />
        <label><span>Name *</span><input name="name" required defaultValue={String(row?.name || '')} /></label>
        <label><span>SEO slug *</span><input name="slug" required defaultValue={String(row?.slug || '')} /></label>
        <label><span>Category</span><select name="pet_type" defaultValue={String(row?.pet_type || 'dog')}><option value="dog">dog</option><option value="cat">cat</option></select></label>
        <label><span>Subcategory</span><select name="subcategory" defaultValue={String(row?.subcategory || 'puppy')}><option>puppy</option><option>kitten</option><option>adult</option><option>adoption</option><option>sale</option></select></label>
        <label><span>Breed</span><input name="breed" defaultValue={String(row?.breed || '')} /></label>
        <label><span>Listing type</span><select name="listing_type" defaultValue={String(row?.listing_type || 'sale')}><option>sale</option><option>adoption</option></select></label>
        <label><span>Gender</span><select name="gender" defaultValue={String(row?.gender || 'unknown')}><option>male</option><option>female</option><option>unknown</option></select></label>
        <label><span>Age</span><input name="age" defaultValue={String(row?.age || '')} /></label>
        <label><span>Price</span><input name="price" type="number" step="0.01" defaultValue={String(row?.price || '')} /></label>
        <label><span>City/location</span><input name="location" defaultValue={String(row?.location || 'Lucknow')} /></label>
        <label><span>Vaccination status</span><input name="vaccination_status" defaultValue={String(row?.vaccination_status || '')} /></label>
        <label><span>Temperament</span><input name="temperament" defaultValue={String(row?.temperament || '')} /></label>
        <label className="admin-field-wide"><span>Health notes</span><textarea name="health_notes" rows={3} defaultValue={String(row?.health_notes || '')} /></label>
        <label className="admin-field-wide"><span>Description</span><textarea name="description" rows={6} defaultValue={String(row?.description || '')} /></label>
        <label><span>Images</span><input type="file" accept="image/*" multiple onChange={upload} /></label>
        <div className="admin-field-wide admin-image-preview">{assets.map((asset) => asset.secure_url ? <Image key={asset.id || asset.secure_url} src={asset.secure_url} alt={asset.alt_text || 'Pet image'} width={160} height={120} /> : null)}{message && <p>{message}</p>}<small>First uploaded image is saved as the featured/main image.</small></div>
        <label><span>Availability status</span><select name="availability_status" defaultValue={String(row?.availability_status || 'available')}><option>available</option><option>reserved</option><option>sold</option><option>adopted</option><option>unavailable</option></select></label>
        <label><span>Status</span><select name="status" defaultValue={String(row?.status || 'published')}><option>draft</option><option>published</option><option>scheduled</option><option>archived</option></select></label>
        <label><span>Meta title</span><input name="meta_title" defaultValue={String(row?.meta_title || '')} /></label>
        <label className="admin-field-wide"><span>Meta description</span><textarea name="meta_description" rows={3} defaultValue={String(row?.meta_description || '')} /></label>
        <div className="admin-field-wide admin-form-actions"><button className="admin-button" type="submit">Save pet</button></div>
      </form>
    </div>
  )
}
