import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import {
  getRecordById,
  updateRecord,
  deleteRecord,
} from '@/lib/server/db/records'
import { createRecordFormSchema } from '@/lib/shared/validators/record'
import { getTranslator } from '@/lib/i18n/get-locale'
import { getUserTimezone } from '@/lib/server/db/profiles'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { deleteStorageImages } from '@/lib/server/storage/record-images'
import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { id } = await params

  try {
    const record = await getRecordById(id)
    if (!record) {
      return NextResponse.json(
        { data: null, error: { code: 'RECORD_NOT_FOUND', message: 'RECORD_NOT_FOUND' } },
        { status: 404 }
      )
    }
    return NextResponse.json({ data: record, error: null })
  } catch (err) {
    console.error('[GET /api/v1/records/[id]]', err)
    return NextResponse.json(
      { data: null, error: { code: 'FETCH_RECORD_FAILED', message: 'FETCH_RECORD_FAILED' } },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) {
    console.error('[PATCH /api/v1/records/[id]] auth failed')
    return errorResponse
  }

  const { id } = await params
  const { t } = await getTranslator()
  const timezone = await getUserTimezone(user.id)

  const body = await request.json()
  const { images: newImages, ...rest } = body

  const parsed = createRecordFormSchema(timezone, t).safeParse(rest)
  if (!parsed.success) {
    console.error('[PATCH /api/v1/records/[id]] validation failed', parsed.error.flatten())
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

  try {
    const existing = await getRecordById(id)
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { data: null, error: { code: 'RECORD_NOT_FOUND', message: 'RECORD_NOT_FOUND' } },
        { status: 404 }
      )
    }

    if (newImages) {
      const newPaths = new Set(newImages.map((img: { storagePath: string }) => img.storagePath))
      const toDelete = existing.images
        .filter((img) => !newPaths.has(img.storage_path))
        .map((img) => img.storage_path)

      if (toDelete.length > 0) {
        await deleteStorageImages(toDelete)
      }

      const admin = createSupabaseAdminClient()
      await admin.from('record_images').delete().eq('record_id', id)
      if (newImages.length > 0) {
        await admin.from('record_images').insert(
          newImages.map((img: {
            storagePath: string
            publicUrl: string
            width?: number
            height?: number
            sizeBytes?: number
          }, idx: number) => ({
            record_id: id,
            storage_path: img.storagePath,
            public_url: img.publicUrl,
            width: img.width ?? null,
            height: img.height ?? null,
            size_bytes: img.sizeBytes ?? null,
            sort_order: idx,
          }))
        )
      }
    }

    await updateRecord(id, user.id, { ...parsed.data, tagIds: body.tagIds })
    return NextResponse.json({ data: { id }, error: null })
  } catch (err) {
    console.error('[PATCH /api/v1/records/[id]]', err)
    return NextResponse.json(
      { data: null, error: { code: 'UPDATE_RECORD_FAILED', message: 'UPDATE_RECORD_FAILED' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { id } = await params

  try {
    const supabase = await createSupabaseServerClient()

    const { data: images } = await supabase
      .from('record_images')
      .select('storage_path')
      .eq('record_id', id)

    await deleteRecord(id, user.id)

    if (images && images.length > 0) {
      await deleteStorageImages(images.map((img) => img.storage_path))
    }

    return NextResponse.json({ data: { id }, error: null })
  } catch (err) {
    console.error('[DELETE /api/v1/records/[id]]', err)
    return NextResponse.json(
      { data: null, error: { code: 'DELETE_RECORD_FAILED', message: 'DELETE_RECORD_FAILED' } },
      { status: 500 }
    )
  }
}
