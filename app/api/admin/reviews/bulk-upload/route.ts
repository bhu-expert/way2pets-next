import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/admin'
import {
  createReviewSampleXlsx,
  importReviewRows,
  parseReviewCsv,
  parseReviewXlsx,
} from '@/lib/review-bulk-import'
import { reviewBulkUploadSampleCsv } from '@/lib/review-bulk-upload-shared'

export const runtime = 'nodejs'

type SupportedFileType = 'csv' | 'xlsx'

function fileTypeFor(file: File): SupportedFileType | null {
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  if (name.endsWith('.csv') || type.includes('csv')) return 'csv'
  if (name.endsWith('.xlsx') || type.includes('spreadsheetml')) return 'xlsx'
  return null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format')

  if (format === 'xlsx') {
    const workbook = createReviewSampleXlsx()
    return new Response(workbook, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="way2pets-reviews-template.xlsx"',
      },
    })
  }

  return new Response(reviewBulkUploadSampleCsv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="way2pets-reviews-template.csv"',
    },
  })
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Admin login required.' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Please choose a CSV or Excel file.' }, { status: 400 })

  const fileType = fileTypeFor(file)
  if (!fileType) {
    return NextResponse.json({ error: '.csv and .xlsx files are supported. Legacy .xls files are not supported yet.' }, { status: 400 })
  }

  try {
    const rows = fileType === 'csv'
      ? parseReviewCsv(await file.text())
      : parseReviewXlsx(Buffer.from(await file.arrayBuffer()))

    const result = await importReviewRows(rows, fileType)
    revalidatePath('/admin/reviews')
    revalidatePath('/reviews')
    revalidatePath('/')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Review bulk import parsing failed.', {
      fileType,
      parsedRowCount: 0,
      validationErrors: [],
      error,
      insertPayloadKeys: [],
    })
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to parse upload.' }, { status: 400 })
  }
}
