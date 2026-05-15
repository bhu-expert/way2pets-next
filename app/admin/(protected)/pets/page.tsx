import Image from 'next/image'
import Link from 'next/link'
import { deleteCmsResource } from '@/lib/admin-actions'
import { formatDate, resources, type CmsRow } from '@/lib/cms'
import { attachPetMedia, mediaKind, petMediaAlt, petMediaPoster, pickPetThumbnail, type PetMedia } from '@/lib/pet-media'
import { getRows } from '@/lib/supabase'

type PetRow = CmsRow & {
  name?: string
  slug?: string
  pet_type?: string
  breed?: string
  listing_type?: string
  price?: number | string | null
  owner_email?: string
  user_id?: string
  availability_status?: string
  status?: string
  media_items?: PetMedia[]
}

type PageProps = { searchParams?: Promise<{ q?: string; status?: string; sort?: string }> }

const sortOptions = [
  ['newest', 'Newest first'],
  ['oldest', 'Oldest first'],
  ['name', 'Name A-Z'],
  ['availability', 'Availability'],
  ['pet_type', 'Pet type'],
  ['listing_type', 'Listing type'],
]

function sortRows(rows: PetRow[], sort: string) {
  return [...rows].sort((a, b) => {
    if (sort === 'oldest') return String(a.created_at || '').localeCompare(String(b.created_at || ''))
    if (sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''))
    if (sort === 'availability') return String(a.availability_status || '').localeCompare(String(b.availability_status || ''))
    if (sort === 'pet_type') return String(a.pet_type || '').localeCompare(String(b.pet_type || ''))
    if (sort === 'listing_type') return String(a.listing_type || '').localeCompare(String(b.listing_type || ''))
    return String(b.created_at || '').localeCompare(String(a.created_at || ''))
  })
}

function priceText(value: PetRow['price']) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = Number(value)
  return Number.isFinite(numeric) ? `₹${numeric.toLocaleString('en-IN')}` : String(value)
}

function PetThumbnail({ pet }: { pet: PetRow }) {
  const thumb = pickPetThumbnail(pet)
  const asset = thumb?.media_assets
  const poster = petMediaPoster(thumb)
  if (!thumb || !asset?.secure_url) return <div className="admin-pet-thumb-placeholder">No image</div>
  if (mediaKind(thumb) === 'video') {
    return poster ? <Image className="admin-pet-thumb-img" src={poster} alt={petMediaAlt(pet, thumb)} width={100} height={80} /> : <div className="admin-pet-thumb-placeholder">Video</div>
  }
  return <Image className="admin-pet-thumb-img" src={asset.secure_url} alt={petMediaAlt(pet, thumb)} width={100} height={80} />
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const resource = resources.pets
  const rows = await getRows<PetRow>('pets?select=*&order=created_at.desc&limit=200', true) || []
  const withMedia = await attachPetMedia(rows, true)
  const q = (params?.q || '').toLowerCase()
  const status = params?.status || ''
  const sort = params?.sort || 'newest'
  const filtered = withMedia.filter((row) => {
    const matchesSearch = !q || ['name', 'breed', 'location', 'owner_email', 'pet_type'].some((field) => String(row[field] || '').toLowerCase().includes(q))
    const matchesStatus = !status || String(row.availability_status || '') === status
    return matchesSearch && matchesStatus
  })
  const sorted = sortRows(filtered, sort)

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>{resource.title}</h1><p>{resource.description}</p></div>
        <Link className="admin-button" href="/admin/pets/new">Add New</Link>
      </div>
      <form className="admin-filters">
        <input name="q" defaultValue={params?.q || ''} placeholder="Search pets..." />
        <select name="status" defaultValue={status}><option value="">All availability</option>{resource.statusOptions?.map((option) => <option key={option} value={option}>{option}</option>)}</select>
        <select name="sort" defaultValue={sort}>{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <button type="submit">Apply</button>
      </form>
      <div className="admin-panel admin-table-wrap">
        <table className="admin-table admin-pets-table">
          <thead><tr><th>Thumbnail</th><th>Name</th><th>Pet Type</th><th>Breed</th><th>Listing Type</th><th>Price</th><th>Owner Email</th><th>Linked User</th><th>Availability</th><th>Status</th><th>Created Date</th><th>Updated Date</th><th>Actions</th></tr></thead>
          <tbody>
            {sorted.length === 0 ? <tr><td colSpan={13}>No pets found. Use “Add New” or adjust filters.</td></tr> : sorted.map((row) => (
              <tr key={String(row.id)}>
                <td><PetThumbnail pet={row} /></td>
                <td>{row.name || '-'}</td>
                <td>{row.pet_type || '-'}</td>
                <td>{row.breed || '-'}</td>
                <td>{row.listing_type || '-'}</td>
                <td>{priceText(row.price)}</td>
                <td>{row.owner_email || '-'}</td>
                <td>{row.user_id || '-'}</td>
                <td>{row.availability_status || '-'}</td>
                <td>{row.status || '-'}</td>
                <td>{formatDate(row.created_at)}</td>
                <td>{formatDate(row.updated_at)}</td>
                <td className="admin-actions">
                  <Link href={`/admin/pets/${row.id}`}>Edit</Link>
                  {row.slug ? <Link href={`/pets/${row.slug}`}>View</Link> : null}
                  <form action={deleteCmsResource}><input type="hidden" name="_resource" value="pets" /><input type="hidden" name="id" value={String(row.id)} /><button type="submit">Delete</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
