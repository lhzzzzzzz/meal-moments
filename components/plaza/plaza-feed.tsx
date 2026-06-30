import { getPlazaRecords } from '@/lib/server/db/plaza'
import { RecordCard } from '@/components/records/record-card'
import { getTranslator } from '@/lib/i18n/get-locale'
import { groupRecordsByDate } from '@/lib/shared/group-records-by-date'
import type { RecordListItem } from '@/types/record'

interface PlazaFeedProps {
  currentUserId?: string
}

export async function PlazaFeed({ currentUserId }: PlazaFeedProps) {
  const { locale, t } = await getTranslator()
  let records: RecordListItem[] = []

  try {
    const result = await getPlazaRecords({
      pageSize: 30,
      viewerUserId: currentUserId,
    })
    records = result.records
  } catch (error) {
    console.error('[PlazaFeed]', error)
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <p className="text-3xl">⚠️</p>
        <p className="mt-3 text-sm font-medium text-foreground">{t('plaza.loadFailed')}</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          {t('plaza.migrationHint')}{' '}
          <code className="rounded bg-muted px-1">{t('plaza.migrationFile1')}</code>{' '}
          {t('common.and')}{' '}
          <code className="rounded bg-muted px-1">{t('plaza.migrationFile2')}</code>{' '}
          {t('plaza.refreshHint')}
        </p>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <p className="text-3xl">🍽️</p>
        <p className="mt-3 text-sm text-muted-foreground">{t('plaza.empty')}</p>
      </div>
    )
  }

  const groups = groupRecordsByDate(records, locale, t)

  return (
    <div className="space-y-6 pb-8">
      {groups.map(({ dateKey, label, items }) => (
        <div key={dateKey}>
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">{label}</h3>
          <div className="space-y-3">
            {items.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                isOwner={currentUserId != null && record.user_id === currentUserId}
                showAuthor
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
