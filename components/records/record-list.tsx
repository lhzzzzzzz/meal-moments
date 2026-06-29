import { getRecords } from '@/lib/server/db/records'
import { RecordCard } from './record-card'
import { formatDateGroup } from '@/lib/shared/formatters/format-date'
import { formatDateOnly } from '@/lib/shared/formatters/format-date'
import type { RecordListItem } from '@/types/record'

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
          {isOwner
            ? '还没有记录，上传今天的第一餐吧。'
            : '还没有可以查看的记录。'}
        </p>
      </div>
    )
  }

  // 按日期分组
  const groups = groupByDate(records)

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
