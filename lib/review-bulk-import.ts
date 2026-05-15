import { inflateRawSync } from 'node:zlib'
import { insertRow, SupabaseRestError } from './supabase'
import { reviewBulkUploadHeaders, reviewBulkUploadSampleCsv, type ReviewBulkImportResult } from './review-bulk-upload-shared'

type ReviewImportRow = Record<string, string>
type ReviewInsert = {
  reviewer_name: string
  rating: number
  review_text: string
  source: string
  source_url: string | null
  reviewed_at: string | null
  status: string
  is_featured: boolean
}

type XlsxCell = { ref: string; value: string }

type ZipEntry = {
  name: string
  compression: number
  compressedSize: number
  uncompressedSize: number
  localHeaderOffset: number
}

const allowedStatuses = new Set(['draft', 'published', 'scheduled', 'archived'])
const trueValues = new Set(['true', 'yes', '1', 'on'])
const falseValues = new Set(['false', 'no', '0', 'off', ''])

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

export function parseReviewCsv(text: string): ReviewImportRow[] {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]
    const nextChar = normalized[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += char + nextChar
        index += 1
      } else {
        inQuotes = !inQuotes
        current += char
      }
      continue
    }

    if (char === '\n' && !inQuotes) {
      if (current.trim()) lines.push(current)
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) lines.push(current)
  if (!lines.length) return []

  const columns = parseCsvLine(lines[0]).map((heading) => heading.trim())
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(columns.map((column, index) => [column, values[index] ?? '']))
  })
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function decodeXml(value: string) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&')
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function zipStore(files: Array<{ name: string; content: string }>) {
  const localParts: Buffer[] = []
  const centralParts: Buffer[] = []
  let offset = 0

  for (const file of files) {
    const nameBuffer = Buffer.from(file.name)
    const contentBuffer = Buffer.from(file.content)
    const checksum = crc32(contentBuffer)
    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0)
    localHeader.writeUInt16LE(20, 4)
    localHeader.writeUInt16LE(0, 6)
    localHeader.writeUInt16LE(0, 8)
    localHeader.writeUInt16LE(0, 10)
    localHeader.writeUInt16LE(0, 12)
    localHeader.writeUInt32LE(checksum, 14)
    localHeader.writeUInt32LE(contentBuffer.length, 18)
    localHeader.writeUInt32LE(contentBuffer.length, 22)
    localHeader.writeUInt16LE(nameBuffer.length, 26)
    localHeader.writeUInt16LE(0, 28)
    localParts.push(localHeader, nameBuffer, contentBuffer)

    const centralHeader = Buffer.alloc(46)
    centralHeader.writeUInt32LE(0x02014b50, 0)
    centralHeader.writeUInt16LE(20, 4)
    centralHeader.writeUInt16LE(20, 6)
    centralHeader.writeUInt16LE(0, 8)
    centralHeader.writeUInt16LE(0, 10)
    centralHeader.writeUInt16LE(0, 12)
    centralHeader.writeUInt16LE(0, 14)
    centralHeader.writeUInt32LE(checksum, 16)
    centralHeader.writeUInt32LE(contentBuffer.length, 20)
    centralHeader.writeUInt32LE(contentBuffer.length, 24)
    centralHeader.writeUInt16LE(nameBuffer.length, 28)
    centralHeader.writeUInt16LE(0, 30)
    centralHeader.writeUInt16LE(0, 32)
    centralHeader.writeUInt16LE(0, 34)
    centralHeader.writeUInt16LE(0, 36)
    centralHeader.writeUInt32LE(0, 38)
    centralHeader.writeUInt32LE(offset, 42)
    centralParts.push(centralHeader, nameBuffer)

    offset += localHeader.length + nameBuffer.length + contentBuffer.length
  }

  const centralDirectory = Buffer.concat(centralParts)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralDirectory.length, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([...localParts, centralDirectory, end])
}

export function createReviewSampleXlsx() {
  const rows = reviewBulkUploadSampleCsv.trimEnd().split('\n').map(parseCsvLine)
  const sheetRows = rows.map((row, rowIndex) => {
    const cells = row.map((value, columnIndex) => {
      const column = String.fromCharCode(65 + columnIndex)
      return `<c r="${column}${rowIndex + 1}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`
    }).join('')
    return `<row r="${rowIndex + 1}">${cells}</row>`
  }).join('')

  return zipStore([
    { name: '[Content_Types].xml', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>' },
    { name: '_rels/.rels', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { name: 'xl/workbook.xml', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Reviews" sheetId="1" r:id="rId1"/></sheets></workbook>' },
    { name: 'xl/_rels/workbook.xml.rels', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>' },
    { name: 'xl/worksheets/sheet1.xml', content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>` },
  ])
}

function readZipEntries(buffer: Buffer) {
  const entries = new Map<string, ZipEntry>()
  let endOffset = -1

  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      endOffset = offset
      break
    }
  }

  if (endOffset < 0) throw new Error('Invalid .xlsx file: missing ZIP directory.')

  const totalEntries = buffer.readUInt16LE(endOffset + 10)
  let centralOffset = buffer.readUInt32LE(endOffset + 16)

  for (let index = 0; index < totalEntries; index += 1) {
    if (buffer.readUInt32LE(centralOffset) !== 0x02014b50) throw new Error('Invalid .xlsx file: corrupt ZIP directory.')
    const compression = buffer.readUInt16LE(centralOffset + 10)
    const compressedSize = buffer.readUInt32LE(centralOffset + 20)
    const uncompressedSize = buffer.readUInt32LE(centralOffset + 24)
    const nameLength = buffer.readUInt16LE(centralOffset + 28)
    const extraLength = buffer.readUInt16LE(centralOffset + 30)
    const commentLength = buffer.readUInt16LE(centralOffset + 32)
    const localHeaderOffset = buffer.readUInt32LE(centralOffset + 42)
    const name = buffer.toString('utf8', centralOffset + 46, centralOffset + 46 + nameLength)
    entries.set(name, { name, compression, compressedSize, uncompressedSize, localHeaderOffset })
    centralOffset += 46 + nameLength + extraLength + commentLength
  }

  return entries
}

function readZipEntry(buffer: Buffer, entry: ZipEntry) {
  const offset = entry.localHeaderOffset
  if (buffer.readUInt32LE(offset) !== 0x04034b50) throw new Error(`Invalid .xlsx file: corrupt ZIP entry ${entry.name}.`)
  const nameLength = buffer.readUInt16LE(offset + 26)
  const extraLength = buffer.readUInt16LE(offset + 28)
  const dataStart = offset + 30 + nameLength + extraLength
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize)

  if (entry.compression === 0) return compressed.toString('utf8')
  if (entry.compression === 8) {
    const inflated = inflateRawSync(compressed)
    if (entry.uncompressedSize && inflated.length !== entry.uncompressedSize) throw new Error(`Invalid .xlsx file: size mismatch in ${entry.name}.`)
    return inflated.toString('utf8')
  }

  throw new Error(`Unsupported .xlsx compression method ${entry.compression}.`)
}

function columnIndex(cellRef: string) {
  const letters = cellRef.replace(/[^A-Z]/gi, '').toUpperCase()
  let index = 0
  for (const letter of letters) index = index * 26 + letter.charCodeAt(0) - 64
  return index - 1
}

function stripTags(value: string) {
  return decodeXml(value.replace(/<[^>]*>/g, ''))
}

function parseSharedStrings(xml: string) {
  return Array.from(xml.matchAll(/<si[^>]*>([\s\S]*?)<\/si>/g)).map((match) => {
    const textParts = Array.from(match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)).map((part) => decodeXml(part[1]))
    return textParts.join('')
  })
}

function parseSheetRows(xml: string, sharedStrings: string[]) {
  return Array.from(xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)).map((rowMatch) => {
    const cells = Array.from(rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)).map((cellMatch): XlsxCell => {
      const attributes = cellMatch[1]
      const body = cellMatch[2]
      const ref = /\br="([A-Z]+\d+)"/i.exec(attributes)?.[1] || ''
      const type = /\bt="([^"]+)"/i.exec(attributes)?.[1] || ''
      const value = /<v[^>]*>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? /<is[^>]*>([\s\S]*?)<\/is>/.exec(body)?.[1] ?? ''
      if (type === 's') return { ref, value: sharedStrings[Number(value)] ?? '' }
      if (type === 'inlineStr') return { ref, value: stripTags(value) }
      return { ref, value: decodeXml(value) }
    })
    const row: string[] = []
    for (const cell of cells) row[columnIndex(cell.ref)] = cell.value
    return row.map((value) => value ?? '')
  })
}

export function parseReviewXlsx(buffer: Buffer): ReviewImportRow[] {
  const entries = readZipEntries(buffer)
  const sharedStringsEntry = entries.get('xl/sharedStrings.xml')
  const sharedStrings = sharedStringsEntry ? parseSharedStrings(readZipEntry(buffer, sharedStringsEntry)) : []
  const sheetEntry = entries.get('xl/worksheets/sheet1.xml') || Array.from(entries.values()).find((entry) => entry.name.startsWith('xl/worksheets/sheet'))
  if (!sheetEntry) throw new Error('Invalid .xlsx file: no worksheet found.')

  const rows = parseSheetRows(readZipEntry(buffer, sheetEntry), sharedStrings).filter((row) => row.some((value) => String(value || '').trim()))
  if (!rows.length) return []
  const columns = rows[0].map((heading) => String(heading || '').trim())
  return rows.slice(1).map((row) => Object.fromEntries(columns.map((column, index) => [column, String(row[index] ?? '').trim()])))
}

function excelSerialDateToIso(value: number) {
  if (!Number.isFinite(value) || value <= 0) return null
  const milliseconds = Math.round((value - 25569) * 86400 * 1000)
  const date = new Date(milliseconds)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

function normalizeDate(value?: string) {
  const trimmed = value?.trim()
  if (!trimmed) return null
  if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
    const iso = excelSerialDateToIso(Number(trimmed))
    if (iso) return { value: iso }
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return { error: 'reviewed_at must be a valid date in YYYY-MM-DD format.' }
  const date = new Date(`${trimmed}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== trimmed) {
    return { error: 'reviewed_at must be a valid date in YYYY-MM-DD format.' }
  }
  return { value: trimmed }
}

function normalizeBoolean(value?: string) {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (trueValues.has(normalized)) return { value: true }
  if (falseValues.has(normalized)) return { value: false }
  return { error: 'is_featured must be true/false, yes/no, or 1/0.' }
}

export function validateReviewRows(rows: ReviewImportRow[]) {
  const valid: ReviewInsert[] = []
  const errors: string[] = []

  rows.forEach((row, index) => {
    const rowNumber = index + 2
    const rowErrors: string[] = []
    const reviewerName = row.reviewer_name?.trim() || ''
    const ratingText = row.rating?.trim() || ''
    const rating = Number(ratingText)
    const reviewText = row.review_text?.trim() || ''
    const source = row.source?.trim() || 'Manual'
    const sourceUrl = row.source_url?.trim() || null
    const status = row.status?.trim() || 'published'
    const reviewedAt = normalizeDate(row.reviewed_at)
    const isFeatured = normalizeBoolean(row.is_featured)

    if (!reviewerName) rowErrors.push('reviewer_name is required.')
    if (!ratingText) rowErrors.push('rating is required.')
    else if (!Number.isFinite(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5) rowErrors.push('rating must be a number between 1 and 5.')
    if (!reviewText) rowErrors.push('review_text is required.')
    if (!allowedStatuses.has(status)) rowErrors.push(`status must be one of ${Array.from(allowedStatuses).join(', ')}.`)
    if (reviewedAt?.error) rowErrors.push(reviewedAt.error)
    if (isFeatured.error) rowErrors.push(isFeatured.error)

    if (rowErrors.length) {
      errors.push(`Row ${rowNumber}: ${rowErrors.join(' ')}`)
      return
    }

    valid.push({
      reviewer_name: reviewerName,
      rating,
      review_text: reviewText,
      source,
      source_url: sourceUrl,
      reviewed_at: reviewedAt?.value ?? null,
      status,
      is_featured: isFeatured.value ?? false,
    })
  })

  return { valid, errors }
}

export async function importReviewRows(rows: ReviewImportRow[], fileType: string): Promise<ReviewBulkImportResult> {
  const { valid, errors } = validateReviewRows(rows)

  console.info('Review bulk import parsed file.', {
    fileType,
    parsedRowCount: rows.length,
    validationErrors: errors,
    insertPayloadKeys: reviewBulkUploadHeaders,
  })

  let imported = 0
  if (valid.length) {
    try {
      const inserted = await insertRow('reviews', valid)
      imported = inserted?.length ?? valid.length
    } catch (error) {
      if (error instanceof SupabaseRestError) {
        console.error('Review bulk import Supabase insert failed.', {
          fileType,
          parsedRowCount: rows.length,
          validationErrors: errors,
          supabase: {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            status: error.status,
            table: error.table,
          },
          insertPayloadKeys: Object.keys(valid[0] || {}),
        })
      } else {
        console.error('Review bulk import insert failed.', {
          fileType,
          parsedRowCount: rows.length,
          validationErrors: errors,
          error,
          insertPayloadKeys: Object.keys(valid[0] || {}),
        })
      }
      errors.push(`Database insert failed for ${valid.length} valid row(s). Please check server logs.`)
    }
  }

  return {
    totalRows: rows.length,
    imported,
    failed: rows.length - imported,
    errors,
  }
}
