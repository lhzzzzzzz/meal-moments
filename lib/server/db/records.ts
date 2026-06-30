import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import type { CreateRecordInput } from '@/lib/shared/validators/record'
import type { RecordWithImages, RecordListItem } from '@/types/record'
import { HOME_FEED_PAGE_SIZE } from '@/lib/shared/constants/feed'

export interface GetRecordsOptions {
  page?: number
  pageSize?: number
  mealType?: string
  tagId?: string
  startDate?: string
  endDate?: string
  sharedOnly?: boolean
  userId: string
}

function mapRecordRows(data: any[]): RecordListItem[] {
  return data.map((r: any) => {
    const sortedImages = (r.record_images ?? []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    )
    return {
      id: r.id,
      user_id: r.user_id,
      author_name: r.profiles?.display_name ?? null,
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
}

export async function getRecords(options: GetRecordsOptions) {
  const supabase = await createSupabaseServerClient()
  const {
    page = 1,
    pageSize = HOME_FEED_PAGE_SIZE,
    mealType,
    startDate,
    endDate,
    sharedOnly,
    userId,
  } = options

  let query = supabase
    .from('records')
    .select(
      `
      id, user_id, title, meal_type, mood, amount, currency, occurred_at, is_shared, note,
      record_images!inner(public_url, sort_order),
      record_tags(tag_id, tags(id, name, color))
    `,
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false })

  if (mealType) query = query.eq('meal_type', mealType)
  if (startDate) query = query.gte('occurred_at', startDate)
  if (endDate) query = query.lte('occurred_at', endDate)
  if (sharedOnly) query = query.eq('is_shared', true)

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query

  if (error) throw error

  const records = mapRecordRows(data ?? [])

  return {
    records,
    total: count ?? 0,
    nextPage: from + pageSize < (count ?? 0) ? page + 1 : null,
  }
}

export async function getCommunityRecords(options: {
  page?: number
  pageSize?: number
}) {
  const supabase = await createSupabaseServerClient()
  const { page = 1, pageSize = HOME_FEED_PAGE_SIZE } = options

  const from = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from('records')
    .select(
      `
      id, user_id, title, meal_type, mood, amount, currency, occurred_at, is_shared, note,
      record_images!inner(public_url, sort_order),
      record_tags(tag_id, tags(id, name, color))
    `,
      { count: 'exact' }
    )
    .eq('is_shared', true)
    .order('occurred_at', { ascending: false })
    .range(from, from + pageSize - 1)

  if (error) throw error

  const rows = data ?? []
  const userIds = [...new Set(rows.map((r: any) => r.user_id as string))]

  let nameMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', userIds)
    nameMap = Object.fromEntries(
      (profiles ?? []).map((p) => [p.id, p.display_name])
    )
  }

  const records = mapRecordRows(
    rows.map((r: any) => ({
      ...r,
      profiles: { display_name: nameMap[r.user_id] ?? null },
    }))
  )

  return {
    records,
    total: count ?? 0,
    nextPage: from + pageSize < (count ?? 0) ? page + 1 : null,
  }
}

export async function getRecordById(id: string): Promise<RecordWithImages | null> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('records')
    .select(
      `
      *,
      record_images(*),
      record_tags(tag_id, tags(*))
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  const images = ((data as any).record_images ?? []).sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  )
  const tags = ((data as any).record_tags ?? [])
    .map((rt: any) => rt.tags)
    .filter(Boolean)

  return { ...(data as any), images, tags }
}

export async function createRecord(
  userId: string,
  input: CreateRecordInput
) {
  const supabase = await createSupabaseServerClient()

  const { data: record, error: recordError } = await supabase
    .from('records')
    .insert({
      user_id: userId,
      title: input.title?.trim() || '',
      note: input.note ?? null,
      meal_type: input.mealType || '',
      mood: input.mood ?? null,
      location: input.location ?? null,
      amount: input.amount ? parseFloat(input.amount) : null,
      currency: input.currency,
      occurred_at: input.occurredAt,
      is_shared: input.isShared,
    })
    .select()
    .single()

  if (recordError) throw recordError

  // 保存图片
  if (input.images.length > 0) {
    const { error: imgError } = await supabase.from('record_images').insert(
      input.images.map((img, idx) => ({
        record_id: record.id,
        storage_path: img.storagePath,
        public_url: img.publicUrl,
        width: img.width ?? null,
        height: img.height ?? null,
        size_bytes: img.sizeBytes ?? null,
        sort_order: idx,
      }))
    )
    if (imgError) throw imgError
  }

  // 保存标签
  if (input.tagIds && input.tagIds.length > 0) {
    const { error: tagError } = await supabase.from('record_tags').insert(
      input.tagIds.map((tagId) => ({ record_id: record.id, tag_id: tagId }))
    )
    if (tagError) throw tagError
  }

  return record
}

export async function updateRecord(
  id: string,
  userId: string,
  input: Partial<CreateRecordInput>
) {
  const supabase = await createSupabaseServerClient()

  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = input.title.trim() || ''
  if (input.note !== undefined) updateData.note = input.note ?? null
  if (input.mealType !== undefined) updateData.meal_type = input.mealType || ''
  if (input.mood !== undefined) updateData.mood = input.mood ?? null
  if (input.location !== undefined) updateData.location = input.location ?? null
  if (input.amount !== undefined)
    updateData.amount = input.amount ? parseFloat(input.amount) : null
  if (input.currency !== undefined) updateData.currency = input.currency
  if (input.occurredAt !== undefined) updateData.occurred_at = input.occurredAt
  if (input.isShared !== undefined) updateData.is_shared = input.isShared

  const { error } = await supabase
    .from('records')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('[updateRecord] DB error', error)
    throw error
  }
  console.log('[updateRecord] records updated successfully')

  // 更新标签（先删后插）
  if (input.tagIds !== undefined) {
    await supabase.from('record_tags').delete().eq('record_id', id)
    if (input.tagIds.length > 0) {
      await supabase
        .from('record_tags')
        .insert(input.tagIds.map((tagId) => ({ record_id: id, tag_id: tagId })))
    }
  }
}

export async function deleteRecord(id: string, userId: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}
