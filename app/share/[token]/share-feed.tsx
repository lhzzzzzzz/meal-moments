import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'
import { getSignedUrls } from '@/lib/server/storage/record-images'
import { RecordCard } from '@/components/records/record-card'
import { formatDateOnly } from '@/lib/shared/formatters/format-date'
import { formatDateGroup } from '@/lib/shared/formatters/format-date'
import type { RecordListItem } from '@/types/record'

interface ShareFeedProps {
  token: string
  userId: string
}

export async function ShareFeed({ userId }: ShareFeedProps) {
  const admin = createSupabaseAdminClient()

  const { data, error } = await admin
    .from('records')
    .select(
      `
      id, title, meal_type, mood, amount, currency, occurred_at, note,
      record_images(public_url, storage_path, sort_order),
      record_tags(tag_id, tags(id, name, color))
    `
    )
    .eq('user_id', userId)
    .eq('is_shared', true)
    .order('occurred_at', { ascending: false })
    .limit(30)

  if (error || !data || data.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">还没有可以查看的记录。</p>
      </div>
    )
  }

  // 批量生成 signed URLs
  const allPaths = data.flatMap((r: any) =>
    (r.record_images ?? []).map((img: any) => img.storage_path)
  )
  const signedMap = await getSignedUrls(allPaths, 3600)

  const records: RecordListItem[] = data.map((r: any) => {
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

  // 按日期分组
  const groups = groupByDate(records)

  return (
    <div className="space-y-6 pb-8">
      {groups.map(({ dateKey, label, items }) => (
        <div key={dateKey}>
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">{label}</h3>
          <div className="space-y-3">
            {items.map((record) => (
              <ShareRecordCard key={record.id} record={record} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function groupByDate(records: RecordListItem[]) {
  const map = new Map<string, RecordListItem[]>()
  for (const r of records) {
    const dateKey = formatDateOnly(r.occurred_at)
    if (!map.has(dateKey)) map.set(dateKey, [])
    map.get(dateKey)!.push(r)
  }
  return Array.from(map.entries()).map(([dateKey, items]) => ({
    dateKey,
    label: formatDateGroup(dateKey + 'T12:00:00'),
    items,
  }))
}

// 分享页的记录卡片（不可点击进详情，只读展示）
function ShareRecordCard({ record }: { record: RecordListItem }) {
  return <RecordCard record={record} isOwner={false} />
}
