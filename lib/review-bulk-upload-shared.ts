export const reviewBulkUploadHeaders = [
  'reviewer_name',
  'rating',
  'review_text',
  'source',
  'source_url',
  'reviewed_at',
  'status',
  'is_featured',
] as const

export const reviewBulkUploadSampleCsv = `${reviewBulkUploadHeaders.join(',')}\nTest Customer,5,Way2Pets took great care of my dog.,Google,,2026-05-14,published,true\nTest Customer 2,4,Good pet boarding service in Lucknow.,Manual,,2026-05-14,published,false\n`

export type ReviewBulkImportResult = {
  totalRows: number
  imported: number
  failed: number
  errors: string[]
}
