import { saveCmsResource, deleteCmsResource } from '@/lib/admin-actions'
import { asText, type CmsRow, type ResourceConfig } from '@/lib/cms'

function valueFor(row: CmsRow | null, name: string, type?: string) {
  const value = row?.[name]
  if (type === 'json') return JSON.stringify(value ?? (name.endsWith('_json') ? (name === 'content_json' || name === 'schema_json' || name === 'value_json' ? {} : []) : {}), null, 2)
  if (typeof value === 'boolean') return value
  return value === null || value === undefined ? '' : String(value)
}

export default function CmsForm({ resourceKey, resource, row }: { resourceKey: string; resource: ResourceConfig; row: CmsRow | null }) {
  return (
    <div>
      <div className="admin-page-header"><div><h1>{row?.id ? `Edit ${resource.title}` : `New ${resource.title}`}</h1><p>{resource.description}</p></div></div>
      <form action={saveCmsResource} className="admin-panel admin-form-grid">
        <input type="hidden" name="_resource" value={resourceKey} />
        {row?.id && <input type="hidden" name="id" value={String(row.id)} />}
        {resource.fields.map((field) => {
          const type = field.type || 'text'
          const value = valueFor(row, field.name, type)
          return (
            <label key={field.name} className={type === 'textarea' || type === 'json' ? 'admin-field-wide' : ''}>
              <span>{field.label}{field.required ? ' *' : ''}</span>
              {type === 'textarea' || type === 'json' ? <textarea name={field.name} defaultValue={String(value)} rows={type === 'json' ? 10 : 5} required={field.required} /> : type === 'select' ? <select name={field.name} defaultValue={String(value || field.options?.[0] || '')}>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select> : type === 'checkbox' ? <input name={field.name} type="checkbox" defaultChecked={Boolean(value)} /> : <input name={field.name} type={type === 'date' ? 'date' : type === 'number' ? 'number' : 'text'} step={type === 'number' ? '0.01' : undefined} defaultValue={String(value)} required={field.required} placeholder={field.placeholder} />}
              {field.help && <small>{field.help}</small>}
            </label>
          )
        })}
        <div className="admin-field-wide admin-form-actions"><button className="admin-button" type="submit">Save</button>{row?.id && <span>Record ID: {asText(row.id)}</span>}</div>
      </form>
      {row?.id && <form action={deleteCmsResource} className="admin-danger-form"><input type="hidden" name="_resource" value={resourceKey} /><input type="hidden" name="id" value={String(row.id)} /><button type="submit">Delete record</button></form>}
    </div>
  )
}
