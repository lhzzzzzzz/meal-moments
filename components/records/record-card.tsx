import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { getMealTypeLabel, getMealTypeEmoji } from '@/lib/shared/constants/meal-types'
import { getMoodEmoji } from '@/lib/shared/constants/moods'
import { formatMoneyShort } from '@/lib/shared/formatters/format-money'
import { formatRelativeDate } from '@/lib/shared/formatters/format-date'
import type { RecordListItem } from '@/types/record'

interface RecordCardProps {
  record: RecordListItem
  isOwner?: boolean
}

export function RecordCard({ record, isOwner }: RecordCardProps) {
  return (
    <Link
      href={`/records/${record.id}`}
      className="block rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-sm active:scale-[0.99]"
    >
      <div className="flex gap-3 p-3">
        {/* 封面图 */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {record.cover_image ? (
            <Image
              src={record.cover_image}
              alt={record.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl image-placeholder">
              {getMealTypeEmoji(record.meal_type)}
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-medium text-foreground">
              {record.title}
            </h3>
            {record.amount != null && (
              <span className="flex-shrink-0 text-sm font-medium text-primary">
                {formatMoneyShort(record.amount)}
              </span>
            )}
          </div>

          {/* 元信息行 */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              {getMealTypeEmoji(record.meal_type)} {getMealTypeLabel(record.meal_type)}
            </span>
            {record.mood && (
              <span className="text-xs text-muted-foreground">
                {getMoodEmoji(record.mood)}
              </span>
            )}
          </div>

          {/* 备注 */}
          {record.note && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {record.note}
            </p>
          )}

          {/* 标签 */}
          {record.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {record.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px]"
                  style={tag.color ? { backgroundColor: tag.color + '33' } : undefined}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* 时间 */}
          <p className="mt-1 text-[11px] text-muted-foreground">
            {formatRelativeDate(record.occurred_at)}
          </p>
        </div>
      </div>
    </Link>
  )
}
