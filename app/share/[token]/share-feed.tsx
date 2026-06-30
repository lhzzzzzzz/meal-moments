import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'
import { getSignedUrls } from '@/lib/server/storage/record-images'
import { RecordCard } from '@/components/records/record-card'
import { getTranslator } from '@/lib/i18n/get-locale'
import { groupRecordsByDate } from '@/lib/shared/group-records-by-date'
import type { RecordListItem } from '@/types/record'

interface ShareFeedProps {
  token: string
  userId: string
}

export async function ShareFeed({ userId }: ShareFeedProps) {
  const { locale, t } = await getTranslator()
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
        <p className="text-muted-foreground">{t('share.emptyFeed')}</p>
      </div>
    )
  }

  const allPaths = data.flatMap((r: { record_images?: { storage_path: string }[] }) =>
    (r.record_images ?? []).map((img) => img.storage_path)
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

  const groups = groupRecordsByDate(records, locale, t)

  return (
    <div className="space-y-6 pb-8">
      {groups.map(({ dateKey, label, items }) => (
        <div key={dateKey}>
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">{label}</h3>
          <div className="space-y-3">
            {items.map((record) => (
              <RecordCard key={record.id} record={record} isOwner={false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
