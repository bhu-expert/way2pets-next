'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { reviewBulkUploadHeaders, reviewBulkUploadSampleCsv, type ReviewBulkImportResult } from '@/lib/review-bulk-upload-shared'

const uploadEndpoint = '/api/admin/reviews/bulk-upload'

type ImportState = ReviewBulkImportResult & { error?: string }

export default function ReviewBulkUpload() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [result, setResult] = useState<ImportState | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  async function importFile() {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setResult({ totalRows: 0, imported: 0, failed: 0, errors: [], error: 'Please choose a CSV or Excel file first.' })
      return
    }

    setIsImporting(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(uploadEndpoint, { method: 'POST', body: formData })
      const payload = await response.json()

      if (!response.ok) {
        setResult({ totalRows: 0, imported: 0, failed: 0, errors: [], error: payload.error || 'Bulk import failed.' })
        return
      }

      setResult(payload)
      if (payload.imported > 0) {
        if (fileInputRef.current) fileInputRef.current.value = ''
        setSelectedFileName('')
        router.refresh()
      }
    } catch (error) {
      setResult({ totalRows: 0, imported: 0, failed: 0, errors: [], error: error instanceof Error ? error.message : 'Bulk import failed.' })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <h2>Bulk Upload Reviews</h2>
          <p>Upload one review per row from the same CSV/Excel template used below. Imports run server-side with admin credentials.</p>
        </div>
      </div>

      <div className="admin-form-actions">
        <a className="admin-button" download="way2pets-reviews-template.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(reviewBulkUploadSampleCsv)}`}>Download Sample CSV</a>
        <a className="admin-button" href={`${uploadEndpoint}?format=xlsx`}>Download Sample Excel</a>
      </div>

      <p><strong>Expected columns:</strong> {reviewBulkUploadHeaders.join(', ')}</p>
      <p><small>Supported uploads: .csv and .xlsx. Legacy .xls files are not supported yet.</small></p>

      <div className="admin-form-grid">
        <label className="admin-field-wide">
          <span>Review file</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            disabled={isImporting}
            onChange={(event) => {
              setSelectedFileName(event.target.files?.[0]?.name || '')
              setResult(null)
            }}
          />
          {selectedFileName && <small>Selected: {selectedFileName}</small>}
        </label>
        <div className="admin-field-wide admin-form-actions">
          <button className="admin-button" type="button" onClick={importFile} disabled={isImporting}>
            {isImporting ? 'Importing…' : 'Upload and Import Reviews'}
          </button>
        </div>
      </div>

      {result && (
        <div aria-live="polite">
          {result.error ? (
            <p><strong>Import failed:</strong> {result.error}</p>
          ) : (
            <>
              <h3>Import result</h3>
              <ul>
                <li>Total rows found: {result.totalRows}</li>
                <li>Imported successfully: {result.imported}</li>
                <li>Failed: {result.failed}</li>
              </ul>
              {result.errors.length > 0 && (
                <div>
                  <h4>Row errors</h4>
                  <ul>
                    {result.errors.map((error) => <li key={error}>{error}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}
