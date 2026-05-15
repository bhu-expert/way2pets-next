import { saveCmsResource, deleteCmsResource } from '@/lib/admin-actions'
import { asText, type CmsRow, type ResourceConfig } from '@/lib/cms'

function valueFor(row: CmsRow | null, name: string, type?: string) {
  const value = row?.[name]
  if (type === 'json') return JSON.stringify(value ?? (name.endsWith('_json') ? (name === 'content_json' || name === 'schema_json' || name === 'value_json' ? {} : []) : {}), null, 2)
  if (typeof value === 'boolean') return value
  return value === null || value === undefined ? '' : String(value)
}

type SettingValueConfig = {
  label: string
  help?: string
  inputType: 'text' | 'email' | 'url' | 'number'
  textarea?: boolean
}

function settingValueConfig(settingKey: string): SettingValueConfig {
  const normalizedKey = settingKey.toLowerCase()
  if (normalizedKey === 'google_maps_public_url') {
    return { label: 'Google Maps public URL', help: 'Link users open in Maps.', inputType: 'url' }
  }
  if (normalizedKey === 'google_maps_embed_url') {
    return { label: 'Google Maps embed URL', help: 'iframe src used on Contact page.', inputType: 'url', textarea: true }
  }
  if (normalizedKey === 'latitude' || normalizedKey === 'longitude') {
    return { label: normalizedKey === 'latitude' ? 'Latitude' : 'Longitude', help: 'Used for schema/local SEO.', inputType: 'number' }
  }
  if (normalizedKey.includes('email')) return { label: 'Email', inputType: 'email' }
  if (normalizedKey.includes('url')) return { label: normalizedKey.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), inputType: 'url' }
  if (normalizedKey.includes('phone') || normalizedKey.includes('whatsapp')) return { label: 'Phone', inputType: 'text' }
  if (normalizedKey.includes('address')) return { label: normalizedKey.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), inputType: 'text' }
  return { label: 'Setting value', inputType: 'text' }
}

function hasSimpleSettingValue(value: unknown) {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, 'value')
}

function settingValueFor(row: CmsRow | null) {
  const valueJson = row?.value_json
  if (hasSimpleSettingValue(valueJson)) {
    const value = (valueJson as { value?: unknown }).value
    return value === null || value === undefined ? '' : String(value)
  }
  if (valueJson === null || valueJson === undefined) return ''
  return JSON.stringify(valueJson, null, 2)
}

function shouldUseSimpleSettingInput(row: CmsRow | null) {
  return !row?.value_json || hasSimpleSettingValue(row.value_json)
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
          const isSettingValue = resourceKey === 'settings' && field.name === 'value_json'
          if (isSettingValue) {
            const settingKey = String(row?.key || '')
            const config = settingValueConfig(settingKey)
            const simpleInput = shouldUseSimpleSettingInput(row)
            if (!simpleInput) {
              return (
                <label key={field.name} className="admin-field-wide">
                  <span>{field.label}{field.required ? ' *' : ''}</span>
                  <textarea name={field.name} defaultValue={settingValueFor(row)} rows={10} required={field.required} />
                  <input type="hidden" name="_value_json_mode" value="json" />
                  <small>This setting has a custom JSON structure. Edit only if you know the expected format.</small>
                </label>
              )
            }
            return (
              <label key={field.name} className={config.textarea ? 'admin-field-wide' : ''}>
                <span>{config.label}{field.required ? ' *' : ''}</span>
                {config.textarea ? (
                  <textarea name={field.name} defaultValue={settingValueFor(row)} rows={5} required={field.required} />
                ) : (
                  <input name={field.name} type={config.inputType} step={config.inputType === 'number' ? 'any' : undefined} defaultValue={settingValueFor(row)} required={field.required} />
                )}
                {config.help && <small>{config.help}</small>}
              </label>
            )
          }
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
