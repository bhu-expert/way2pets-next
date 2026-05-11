import Link from 'next/link'
import { asText, formatDate, type CmsRow, type ResourceConfig } from '@/lib/cms'
import { deleteCmsResource } from '@/lib/admin-actions'

export default function CmsList({ resourceKey, resource, rows, search = '', status = '' }: { resourceKey: string; resource: ResourceConfig; rows: CmsRow[]; search?: string; status?: string }) {
  return (
    <div>
      <div className="admin-page-header">
        <div><h1>{resource.title}</h1><p>{resource.description}</p></div>
        {resource.newPath && <Link className="admin-button" href={resource.newPath}>Add New</Link>}
      </div>
      <form className="admin-filters">
        <input name="q" defaultValue={search} placeholder="Search records..." />
        {resource.statusKey && <select name="status" defaultValue={status}><option value="">All statuses</option>{resource.statusOptions?.map((option) => <option key={option} value={option}>{option}</option>)}</select>}
        <button type="submit">Filter</button>
      </form>
      <div className="admin-panel">
        <table className="admin-table">
          <thead><tr>{resource.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Actions</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={resource.columns.length + 1}>No records found. Use “Add New” or submit a public form to create records.</td></tr> : rows.map((row) => (
              <tr key={String(row.id)}>
                {resource.columns.map((column) => <td key={column.key}>{column.key.includes('_at') || column.key.includes('date') ? formatDate(row[column.key]) : asText(row[column.key])}</td>)}
                <td className="admin-actions">
                  {resource.editPath && <Link href={`${resource.editPath}/${row.id}`}>Edit</Link>}
                  <form action={deleteCmsResource}><input type="hidden" name="_resource" value={resourceKey} /><input type="hidden" name="id" value={String(row.id)} /><button type="submit">Delete</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
