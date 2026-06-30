import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { getRecords, getCommunityRecords, createRecord } from '@/lib/server/db/records'
import { createRecordSchema } from '@/lib/shared/validators/record'
import { getTranslator } from '@/lib/i18n/get-locale'
import { deleteStorageImages } from '@/lib/server/storage/record-images'
import { getUserTimezone } from '@/lib/server/db/profiles'
import { HOME_FEED_PAGE_SIZE } from '@/lib/shared/constants/feed'
import type { FeedScope } from '@/lib/shared/constants/feed'

export async function GET(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { searchParams } = request.nextUrl
  const scope = (searchParams.get('scope') ?? 'mine') as FeedScope
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? String(HOME_FEED_PAGE_SIZE))
  const mealType = searchParams.get('mealType') ?? undefined
  const startDate = searchParams.get('startDate') ?? undefined
  const endDate = searchParams.get('endDate') ?? undefined
  const sharedOnly = searchParams.get('sharedOnly') === 'true'

  try {
    const result =
      scope === 'community'
        ? await getCommunityRecords({ page, pageSize })
        : await getRecords({
            userId: user.id,
            page,
            pageSize,
            mealType,
            startDate,
            endDate,
            sharedOnly,
          })
    return NextResponse.json({ data: result, error: null })
  } catch (err) {
    console.error('[GET /api/v1/records]', err)
    return NextResponse.json(
      { data: null, error: { code: 'FETCH_RECORDS_FAILED', message: 'FETCH_RECORDS_FAILED' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { t } = await getTranslator()
  const timezone = await getUserTimezone(user.id)
  const body = await request.json()
  const parsed = createRecordSchema(timezone, t).safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: 'INVALID_PARAMS',
          message: 'INVALID_PARAMS',
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    )
  }

  const uploadedPaths = parsed.data.images.map((img) => img.storagePath)

  try {
    const record = await createRecord(user.id, parsed.data)
    return NextResponse.json(
      { data: { recordId: record.id, createdAt: record.created_at }, error: null },
      { status: 201 }
    )
  } catch (err) {
    try {
      await deleteStorageImages(uploadedPaths)
    } catch (cleanupErr) {
      console.error('[POST /api/v1/records] cleanup error', cleanupErr)
    }
    console.error('[POST /api/v1/records]', err)
    return NextResponse.json(
      { data: null, error: { code: 'CREATE_RECORD_FAILED', message: 'CREATE_RECORD_FAILED' } },
      { status: 500 }
    )
  }
}
