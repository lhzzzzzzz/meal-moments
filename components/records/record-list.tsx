import { getRecords } from '@/lib/server/db/records'
import { RecordCard } from './record-card'
import { getTranslator } from '@/lib/i18n/get-locale'
import { groupRecordsByDate } from '@/lib/shared/group-records-by-date'

interface RecordListProps {
  userId: string
  isOwner?: boolean
  mealType?: string
  startDate?: string
  endDate?: string
  sharedOnly?: boolean
}

export async function RecordList({
  userId,
  isOwner,
  mealType,
  startDate,
  endDate,
  sharedOnly,
}: RecordListProps) {
  const { locale, t } = await getTranslator()
  const { records } = await getRecords({
    userId,
    mealType,
    startDate,
    endDate,
    sharedOnly,
    pageSize: 30,
  })

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <p className="text-3xl">🍽️</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {isOwner ? t('record.emptyMine') : t('record.emptyShared')}
        </p>
      </div>
    )
  }

  const groups = groupRecordsByDate(records, locale, t)

  return (
    <div className="space-y-6">
      {groups.map(({ dateKey, label, items }) => (
        <div key={dateKey}>
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">{label}</h3>
          <div className="space-y-3">
            {items.map((record) => (
              <RecordCard key={record.id} record={record} isOwner={isOwner} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
