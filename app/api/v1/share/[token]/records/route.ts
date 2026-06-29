import { NextRequest, NextResponse } from 'next/server'
import { getShareLinkByToken } from '@/lib/server/db/share-links'
import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'
import { getSignedUrls } from '@/lib/server/storage/record-images'
import type { RecordListItem } from '@/types/record'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  // 校验 token
  const shareLink = await getShareLinkByToken(token)
  if (!shareLink) {
    return NextResponse.json(
      { data: null, error: { message: '这个分享链接暂时不可用。', code: 'INVALID_TOKEN' } },
      { status: 404 }
    )
  }

  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20')
  const mealType = searchParams.get('mealType') ?? undefined

  const from = (page - 1) * pageSize

  try {
    const admin = createSupabaseAdminClient()

    let query = admin
      .from('records')
      .select(
        `
        id, title, meal_type, mood, amount, currency, occurred_at, note,
        record_images(public_url, storage_path, sort_order),
        record_tags(tag_id, tags(id, name, color))
      `,
        { count: 'exact' }
      )
      .eq('user_id', shareLink.user_id)
      .eq('is_shared', true)
      .order('occurred_at', { ascending: false })
      .range(from, from + pageSize - 1)

    if (mealType) query = query.eq('meal_type', mealType)

    const { data, error, count } = await query

    if (error) throw error

    // 收集所有图片路径，批量生成 signed URL
    const allPaths: string[] = []
    for (const r of data ?? []) {
      for (const img of (r as any).record_images ?? []) {
        allPaths.push(img.storage_path)
      }
    }
    const signedMap = await getSignedUrls(allPaths, 3600)

    const records: RecordListItem[] = (data ?? []).map((r: any) => {
      const sortedImages = (r.record_images ?? []).sort(
        (a: any, b: any) => a.sort_order - b.sort_order
      )
      const coverPath = sortedImages[0]?.storage_path
      return {
        id: r.id,
        title: r.title,
        meal_type: r.meal_type,
        mood: r.mood,
        amount: r.amount,
        currency: r.currency,
        occurred_at: r.occurred_at,
        is_shared: true,
        note: r.note,
        cover_image: coverPath ? signedMap[coverPath] ?? null : null,
        tags: (r.record_tags ?? []).map((rt: any) => rt.tags).filter(Boolean),
      }
    })

    return NextResponse.json({
      data: {
        records,
        total: count ?? 0,
        nextPage: from + pageSize < (count ?? 0) ? page + 1 : null,
      },
      error: null,
    })
  } catch (err) {
    console.error('[GET /api/v1/share/[token]/records]', err)
    return NextResponse.json(
      { data: null, error: { message: '获取分享内容失败' } },
      { status: 500 }
    )
  }
}
