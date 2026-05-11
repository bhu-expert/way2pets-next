'use client'

import { useState } from 'react'
import { bulkImportReviews } from '@/lib/admin-actions'

const headers = ['reviewer_name', 'rating', 'review_text', 'source', 'source_url', 'reviewed_at', 'status', 'is_featured']
const sample = `${headers.join(',')}\nTest Customer,5,"Way2Pets took great care of my dog.",Google,https://example.com,2026-05-11,published,true\n`

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/)
  const cols = lines.shift()?.split(',').map((h) => h.trim()) || []
  return lines.map((line) => {
    const values = line.match(/("[^"]*(?:""[^"]*)*"|[^,]+)/g)?.map((value) => value.replace(/^"|"$/g, '').replaceAll('""', '"').trim()) || []
    return Object.fromEntries(cols.map((col, index) => [col, values[index] || '']))
  })
}

export default function ReviewBulkUpload() {
  const [rows, setRows] = useState<Array<Record<string, string>>>([])
  const [message, setMessage] = useState('')

  async function load(file?: File) {
    if (!file) return
    if (!file.name.endsWith('.csv')) { setMessage('Please upload CSV. Excel can be exported to CSV first.'); return }
    const parsed = parseCsv(await file.text())
    setRows(parsed)
    setMessage(`${parsed.length} rows ready for preview/import.`)
  }

  async function importRows() {
    const result = await bulkImportReviews(rows)
    setMessage(`Imported ${result.imported}. Failed ${result.failed}.${result.errors.length ? ` ${result.errors.join(' ')}` : ''}`)
    if (!result.errors.length) setRows([])
  }

  return (
    <div className="admin-panel">
      <h2>Bulk upload reviews from CSV</h2>
      <p>CSV columns: {headers.join(', ')}. Export Excel files to CSV before upload.</p>
      <a className="admin-button" download="way2pets-reviews-template.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(sample)}`}>Download CSV template</a>
      <input type="file" accept=".csv,text/csv" onChange={(event) => load(event.target.files?.[0])} />
      {rows.length > 0 && <><h3>Preview first 5 rows</h3><pre>{JSON.stringify(rows.slice(0, 5), null, 2)}</pre><button className="admin-button" type="button" onClick={importRows}>Import valid rows</button></>}
      {message && <p>{message}</p>}
    </div>
  )
}
