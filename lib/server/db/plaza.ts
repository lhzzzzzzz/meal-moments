import { unstable_cache } from 'next/cache'
import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'
import { getCommunityRecords } from '@/lib/server/db/records'
import type { RecordListItem } from '@/types/record'

/** 游客广场列表缓存时长（秒） */
const PLAZA_CACHE_TTL = 60

export interface GetPlazaRecordsOptions {
  page?: number
  pageSize?: number
  /** 已登录用户 ID；有值时走 authenticated RLS，无值时走 service_role 公开读 */
  viewerUserId?: string
}

async function fetchPublicPlazaRecords(options: {
  page?: number
  pageSize?: number
}) {
  const { page = 1, pageSize = 30 } = options
  const supabase = createSupabaseAdminClient()
  const from = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from('records')
    .select(
      `
      id, user_id, title, meal_type, mood, amount, currency, occurred_at, is_shared, note,
      record_images(public_url, sort_order),
      record_tags(tag_id, tags(id, name, color))
    `,
      { count: 'exact' }
    )
    .eq('is_shared', true)
    .order('occurred_at', { ascending: false })
    .range(from, from + pageSize - 1)

  if (error) throw error

  const rows = data ?? []
  const userIds = [...new Set(rows.map((r) => r.user_id))]

  const profileMap = new Map<string, string>()
  if (userIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', userIds)

    if (profileError) throw profileError

    for (const profile of profiles ?? []) {
      profileMap.set(profile.id, profile.display_name)
    }
  }

  const records: RecordListItem[] = (rows as any[]).map((r) => {
    const sortedImages = (r.record_images ?? []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order
    )
    return {
      id: r.id,
      user_id: r.user_id,
      author_name: profileMap.get(r.user_id) ?? null,
      title: r.title,
      meal_type: r.meal_type,
      mood: r.mood,
      amount: r.amount,
      currency: r.currency,
      occurred_at: r.occurred_at,
      is_shared: r.is_shared,
      note: r.note,
      cover_image: sortedImages[0]?.public_url ?? null,
      tags: (r.record_tags ?? []).map((rt: any) => rt.tags).filter(Boolean),
    }
  })

  return {
    records,
    total: count ?? 0,
    nextPage: from + pageSize < (count ?? 0) ? page + 1 : null,
  }
}

const getCachedPublicPlazaRecords = unstable_cache(
  async (page: number, pageSize: number) =>
    fetchPublicPlazaRecords({ page, pageSize }),
  ['public-plaza-records'],
  { revalidate: PLAZA_CACHE_TTL, tags: ['plaza-feed'] }
)

export async function getPlazaRecords(options: GetPlazaRecordsOptions = {}) {
  const { viewerUserId, page = 1, pageSize = 30 } = options

  if (viewerUserId) {
    return getCommunityRecords({ page, pageSize })
  }

  return getCachedPublicPlazaRecords(page, pageSize)
}
