import Image from 'next/image'
import Link from 'next/link'
import { deleteCmsResource } from '@/lib/admin-actions'
import { asText, formatDate } from '@/lib/cms'

export type GalleryListRow = {
  id?: string
  title?: string | null
  caption?: string | null
  alt_text?: string | null
  category?: string | null
  subcategory?: string | null
  is_visible?: boolean | null
  is_featured?: boolean | null
  sort_order?: number | null
  created_at?: string
  media_asset_id?: string | null
  media_assets?: {
    secure_url?: string | null
    title?: string | null
    alt_text?: string | null
    width?: number | null
    height?: number | null
  } | null
}

function textFallback(...values: Array<string | number | null | undefined>) {
  for (const value of values) {
    const text = String(value ?? '').trim()
    if (text) return text
  }
  return ''
}

function galleryTitle(row: GalleryListRow) {
  return textFallback(row.title, row.media_assets?.title)
}

function galleryAlt(row: GalleryListRow) {
  return textFallback(row.alt_text, row.media_assets?.alt_text, galleryTitle(row), 'Gallery image')
}

function galleryCaption(row: GalleryListRow) {
  return textFallback(row.caption)
}

export function gallerySearchText(row: GalleryListRow) {
  return [
    galleryTitle(row),
    galleryCaption(row),
    galleryAlt(row),
    row.category,
    row.subcategory,
    row.media_asset_id,
  ].filter(Boolean).join(' ').toLowerCase()
}

export default function GalleryList({ rows, search = '', status = '' }: { rows: GalleryListRow[]; search?: string; status?: string }) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Gallery Manager</h1>
          <p>Upload Cloudinary images and control public gallery visibility.</p>
        </div>
        <Link className="admin-button" href="/admin/gallery?new=1">Add New</Link>
      </div>
      <form className="admin-filters">
        <input name="q" defaultValue={search} placeholder="Search title, caption, alt text, category..." />
        <select name="status" defaultValue={status}>
          <option value="">All visibility</option>
          <option value="true">Visible</option>
          <option value="false">Hidden</option>
        </select>
        <button type="submit">Filter</button>
      </form>
      <div className="admin-panel admin-table-wrap">
        <table className="admin-table admin-gallery-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Caption</th>
              <th>Alt text</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Visible</th>
              <th>Featured</th>
              <th>Sort order</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={11}>No gallery images found. Upload a gallery image to create a record.</td></tr>
            ) : rows.map((row) => {
              const id = String(row.id || '')
              const imageUrl = row.media_assets?.secure_url || ''
              const title = galleryTitle(row)
              const alt = galleryAlt(row)
              return (
                <tr key={id}>
                  <td>
                    {imageUrl ? (
                      <a className="admin-gallery-thumb-link" href={imageUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open full image: ${alt}`}>
                        <Image
                          className="admin-gallery-thumb"
                          src={imageUrl}
                          alt={alt}
                          width={100}
                          height={80}
                          sizes="100px"
                        />
                      </a>
                    ) : <span className="admin-muted">No image</span>}
                  </td>
                  <td>{asText(title)}</td>
                  <td>{asText(galleryCaption(row))}</td>
                  <td>{asText(alt)}</td>
                  <td>{asText(row.category)}</td>
                  <td>{asText(row.subcategory)}</td>
                  <td>{asText(row.is_visible)}</td>
                  <td>{asText(row.is_featured)}</td>
                  <td>{asText(row.sort_order)}</td>
                  <td>{formatDate(row.created_at)}</td>
                  <td className="admin-actions">
                    <Link href={`/admin/gallery/${id}`}>Edit</Link>
                    {imageUrl ? <a href={imageUrl} target="_blank" rel="noopener noreferrer">View</a> : null}
                    <form action={deleteCmsResource}>
                      <input type="hidden" name="_resource" value="gallery" />
                      <input type="hidden" name="id" value={id} />
                      <button type="submit">Delete</button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
