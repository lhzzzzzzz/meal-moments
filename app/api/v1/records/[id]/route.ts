import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import {
  getRecordById,
  updateRecord,
  deleteRecord,
} from '@/lib/server/db/records'
import { recordFormSchema } from '@/lib/shared/validators/record'
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
    const record = await getRecordById(id, user.id)
    if (!record) {
      return NextResponse.json(
        { data: null, error: { message: '记录不存在' } },
        { status: 404 }
      )
    }
    return NextResponse.json({ data: record, error: null })
  } catch (err) {
    console.error('[GET /api/v1/records/[id]]', err)
    return NextResponse.json(
      { data: null, error: { message: '获取记录失败' } },
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
  console.log('[PATCH /api/v1/records/[id]] user:', user.id, 'record:', id)

  const body = await request.json()
  console.log('[PATCH /api/v1/records/[id]] body keys:', Object.keys(body))

  // 编辑时同时处理图片差异
  const { images: newImages, ...rest } = body

  const parsed = recordFormSchema.safeParse(rest)
  if (!parsed.success) {
    console.error('[PATCH /api/v1/records/[id]] validation failed', parsed.error.flatten())
    return NextResponse.json(
      { data: null, error: { message: '参数有误', details: parsed.error.flatten() } },
      { status: 400 }
    )
  }

  console.log('[PATCH /api/v1/records/[id]] validation passed, newImages count:', newImages?.length)

  try {
    // 获取原有图片，计算需要删除的
    const existing = await getRecordById(id, user.id)
    if (!existing) {
      return NextResponse.json(
        { data: null, error: { message: '记录不存在' } },
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

      // 删除旧 record_images 行，重新插入
      const admin = createSupabaseAdminClient()
      await admin.from('record_images').delete().eq('record_id', id)
      if (newImages.length > 0) {
        await admin.from('record_images').insert(
          newImages.map((img: any, idx: number) => ({
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

    console.log('[PATCH /api/v1/records/[id]] calling updateRecord...')
    await updateRecord(id, user.id, { ...parsed.data, tagIds: body.tagIds })
    console.log('[PATCH /api/v1/records/[id]] done, returning success')
    return NextResponse.json({ data: { id }, error: null })
  } catch (err) {
    console.error('[PATCH /api/v1/records/[id]]', err)
    return NextResponse.json(
      { data: null, error: { message: '更新记录失败' } },
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

    // 先获取图片路径，用于删除 Storage 文件
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
      { data: null, error: { message: '删除记录失败' } },
      { status: 500 }
    )
  }
}
