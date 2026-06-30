import type { RecordListItem } from '@/types/record'
import type { Locale } from '@/lib/i18n/config'
import type { Translator } from '@/lib/i18n/t'
import { formatDateGroup, formatDateOnly } from '@/lib/shared/formatters/format-date'

export function groupRecordsByDate(
  records: RecordListItem[],
  locale: Locale,
  t: Translator
) {
  const map = new Map<string, RecordListItem[]>()
  for (const r of records) {
    const dateKey = formatDateOnly(r.occurred_at)
    if (!map.has(dateKey)) map.set(dateKey, [])
    map.get(dateKey)!.push(r)
  }
  return Array.from(map.entries()).map(([dateKey, items]) => ({
    dateKey,
    label: formatDateGroup(dateKey + 'T12:00:00', locale, t),
    items,
  }))
}
