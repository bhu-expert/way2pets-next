'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { savePetWithImages } from '@/lib/admin-actions'
import type { CmsRow } from '@/lib/cms'
import { mediaKind, petMediaAlt, petMediaPoster, petMediaUrl, sortPetMedia, type PetMedia } from '@/lib/pet-media'

type PetEditorRow = CmsRow & { media_items?: PetMedia[] }

type PetEditorProps = { row: PetEditorRow | null; mediaError?: string }

export default function PetEditor({ row, mediaError }: PetEditorProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const mediaItems = useMemo(() => sortPetMedia(row?.media_items || []), [row?.media_items])
  const featuredMediaId = mediaItems.find((item) => item.is_featured && mediaKind(item) === 'image')?.id || ''
  const hasExistingMedia = mediaItems.length > 0

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{row?.id ? 'Edit Pet' : 'New Pet'}</h1>
          <p>Upload multiple pet images or puppy videos. Existing media stays attached unless you explicitly remove it.</p>
        </div>
      </div>

      {mediaError ? <div className="admin-alert admin-alert-warning">{mediaError}</div> : null}

      <form action={savePetWithImages} className="admin-panel admin-form-grid">
        {row?.id && <input type="hidden" name="id" value={String(row.id)} />}

        <label><span>Name *</span><input name="name" required defaultValue={String(row?.name || '')} /></label>
        <label><span>SEO slug</span><input name="slug" defaultValue={String(row?.slug || '')} placeholder="Auto-generated from name if blank" /></label>
        <label><span>Category *</span><select name="pet_type" required defaultValue={String(row?.pet_type || 'dog')}><option value="dog">dog</option><option value="cat">cat</option></select></label>
        <label><span>Subcategory</span><select name="subcategory" defaultValue={String(row?.subcategory || 'puppy')}><option>puppy</option><option>kitten</option><option>adult</option><option>adoption</option><option>sale</option></select></label>
        <label><span>Breed</span><input name="breed" defaultValue={String(row?.breed || '')} /></label>
        <label><span>Listing type *</span><select name="listing_type" required defaultValue={String(row?.listing_type || 'sale')}><option>sale</option><option>adoption</option></select></label>
        <label><span>Gender</span><select name="gender" defaultValue={String(row?.gender || 'unknown')}><option>male</option><option>female</option><option>unknown</option></select></label>
        <label><span>Age</span><input name="age" defaultValue={String(row?.age || '')} /></label>
        <label><span>Price (required for sale)</span><input name="price" type="number" step="0.01" defaultValue={String(row?.price || '')} /></label>
        <label><span>City/location</span><input name="location" defaultValue={String(row?.location || 'Lucknow')} /></label>
        <label><span>Vaccination status</span><input name="vaccination_status" defaultValue={String(row?.vaccination_status || '')} /></label>
        <label><span>Temperament</span><input name="temperament" defaultValue={String(row?.temperament || '')} /></label>
        <label><span>Owner email</span><input name="owner_email" type="email" defaultValue={String(row?.owner_email || '')} /></label>
        <label><span>Linked user ID</span><input name="user_id" defaultValue={String(row?.user_id || '')} /></label>
        <label className="admin-checkbox"><input name="editable_by_user" type="checkbox" defaultChecked={row?.editable_by_user !== false} /> <span>Editable by linked user</span></label>
        <label className="admin-field-wide"><span>Health notes</span><textarea name="health_notes" rows={3} defaultValue={String(row?.health_notes || '')} /></label>
        <label className="admin-field-wide"><span>Description</span><textarea name="description" rows={6} defaultValue={String(row?.description || '')} /></label>

        <section className="admin-field-wide pet-media-section" aria-labelledby="pet-media-heading">
          <div className="pet-media-section-header">
            <div>
              <h2 id="pet-media-heading">Pet Images &amp; Videos</h2>
              <p>Supported: JPG, PNG, WEBP, AVIF images and MP4, MOV, WEBM puppy videos. Videos are never used as the main thumbnail while an image exists.</p>
            </div>
          </div>

          {hasExistingMedia ? (
            <div className="pet-media-grid">
              {mediaItems.map((item) => {
                const url = petMediaUrl(item)
                const poster = petMediaPoster(item)
                const isVideo = mediaKind(item) === 'video'
                return (
                  <article className="pet-media-card" key={item.id}>
                    <input type="hidden" name="pet_media_id" value={item.id} />
                    <div className="pet-media-preview">
                      {isVideo ? (
                        <video src={url} poster={poster || undefined} controls preload="metadata" />
                      ) : url ? (
                        <Image src={url} alt={petMediaAlt(row || {}, item)} width={220} height={160} className="pet-media-image" />
                      ) : <div className="pet-media-placeholder">Missing media URL</div>}
                    </div>
                    <div className="pet-media-card-title">
                      <strong>{isVideo ? 'Video' : 'Image'}</strong>
                      {item.is_featured && !isVideo ? <span className="pet-media-badge">Featured</span> : null}
                    </div>
                    <label><span>Title</span><input name={`media_title_${item.id}`} defaultValue={item.title || item.media_assets?.title || ''} /></label>
                    <label><span>Alt text</span><input name={`media_alt_text_${item.id}`} defaultValue={item.alt_text || item.media_assets?.alt_text || ''} /></label>
                    <label><span>Caption</span><textarea name={`media_caption_${item.id}`} rows={2} defaultValue={item.caption || item.media_assets?.caption || ''} /></label>
                    <label><span>Sort order</span><input name={`media_sort_order_${item.id}`} type="number" defaultValue={Number(item.sort_order || 0)} /></label>
                    {!isVideo ? <label className="admin-checkbox"><input type="radio" name="featured_media_id" value={item.id} defaultChecked={item.id === featuredMediaId} /> <span>Set as featured image</span></label> : null}
                    <label className="admin-checkbox admin-danger-check"><input type="checkbox" name={`delete_media_${item.id}`} /> <span>Remove this media</span></label>
                    <small>To replace this item, remove it and upload the replacement file below in the same save.</small>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="pet-media-empty">No existing pet media. Upload images or a puppy video below.</div>
          )}

          <div className="pet-media-upload-box">
            <label>
              <span>Add images/videos</span>
              <input type="file" name="media_files" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/quicktime,video/webm,.jpg,.jpeg,.png,.webp,.avif,.mp4,.mov,.webm" multiple onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))} />
            </label>
            <div className="admin-inline-fields">
              <label><span>New media title</span><input name="new_media_title" placeholder={String(row?.name || 'Pet listing media')} /></label>
              <label><span>New media alt text</span><input name="new_media_alt_text" placeholder="Describe the pet, breed and city" /></label>
              <label><span>New media caption</span><input name="new_media_caption" /></label>
            </div>
            {selectedFiles.length ? <p className="pet-media-selected">Selected {selectedFiles.length} file(s): {selectedFiles.map((file) => file.name).join(', ')}</p> : null}
            <small>First uploaded image becomes featured automatically when no featured image exists. Uploads happen server-side after the pet record is saved.</small>
          </div>
        </section>

        <label><span>Availability status</span><select name="availability_status" defaultValue={String(row?.availability_status || 'available')}><option>available</option><option>reserved</option><option>sold</option><option>adopted</option><option>unavailable</option></select></label>
        <label><span>Status</span><select name="status" defaultValue={String(row?.status || 'published')}><option>draft</option><option>published</option><option>scheduled</option><option>archived</option></select></label>
        <label><span>Meta title</span><input name="meta_title" defaultValue={String(row?.meta_title || '')} placeholder="Recommended" /></label>
        <label className="admin-field-wide"><span>Meta description</span><textarea name="meta_description" rows={3} defaultValue={String(row?.meta_description || '')} placeholder="Recommended for SEO" /></label>
        <div className="admin-field-wide admin-form-actions"><button className="admin-button" type="submit">Save pet</button></div>
      </form>
    </div>
  )
}
