import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { getRecords, createRecord } from '@/lib/server/db/records'
import { createRecordSchema } from '@/lib/shared/validators/record'
import { deleteStorageImages } from '@/lib/server/storage/record-images'

export async function GET(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20')
  const mealType = searchParams.get('mealType') ?? undefined
  const startDate = searchParams.get('startDate') ?? undefined
  const endDate = searchParams.get('endDate') ?? undefined
  const sharedOnly = searchParams.get('sharedOnly') === 'true'

  try {
    const result = await getRecords({
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
      { data: null, error: { message: '获取记录失败' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const body = await request.json()
  const parsed = createRecordSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          message: '请求参数有误',
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
    // 创建失败时，回收已上传的图片文件
    try {
      await deleteStorageImages(uploadedPaths)
    } catch (cleanupErr) {
      console.error('[POST /api/v1/records] cleanup error', cleanupErr)
    }
    console.error('[POST /api/v1/records]', err)
    return NextResponse.json(
      { data: null, error: { message: '创建记录失败，请重试' } },
      { status: 500 }
    )
  }
}
