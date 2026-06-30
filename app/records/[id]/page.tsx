import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Pencil, MapPin, Clock } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { DeleteRecordButton } from './delete-record-button'
import { getCurrentUserOrNull } from '@/lib/server/auth/get-current-user'
import { getRecordById } from '@/lib/server/db/records'
import { getMealTypeLabel, getMealTypeEmoji } from '@/lib/shared/constants/meal-types'
import { getMoodLabel, getMoodEmoji } from '@/lib/shared/constants/moods'
import { formatMoneyShort } from '@/lib/shared/formatters/format-money'
import { formatDateTime, formatDateOnly } from '@/lib/shared/formatters/format-date'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await getCurrentUserOrNull()
  if (!user) return { title: '记录详情 - Meal Moments' }
  const record = await getRecordById(id, user.id)
  return { title: record?.title ? `${record.title} - Meal Moments` : '记录详情 - Meal Moments' }
}

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUserOrNull()
  if (!user) notFound()

  const record = await getRecordById(id, user.id)
  if (!record) notFound()

  const isOwner = user.id === record.user_id
  const sortedImages = [...record.images].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PageShell>
      <div className="py-5">
        {/* 顶部导航 */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="返回"
          >
            <ArrowLeft size={18} />
          </Link>
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/records/${id}/edit`}
                className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="编辑"
              >
                <Pencil size={14} />
                编辑
              </Link>
              <DeleteRecordButton recordId={id} />
            </div>
          )}
        </div>

        {/* 图片 */}
        {sortedImages.length > 0 && (
          <div className={`mb-4 grid gap-2 ${sortedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {sortedImages.map((img, idx) => (
              <div
                key={img.id}
                className={`relative overflow-hidden rounded-xl bg-muted ${
                  sortedImages.length === 1 ? 'aspect-[4/3]' : 'aspect-square'
                } ${sortedImages.length === 3 && idx === 0 ? 'col-span-2' : ''}`}
              >
                <Image
                  src={img.public_url}
                  alt={`${record.title} - 图片 ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 480px) 100vw, 480px"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        )}

        {/* 标题和餐别 */}
        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {record.meal_type && (
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
                {getMealTypeEmoji(record.meal_type)} {getMealTypeLabel(record.meal_type)}
              </span>
            )}
            {record.mood && (
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
                {getMoodEmoji(record.mood)} {getMoodLabel(record.mood)}
              </span>
            )}
            {!record.is_shared && isOwner && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                仅自己可见
              </span>
            )}
          </div>
          <h1 className="mt-2 text-xl font-semibold text-foreground">
            {record.title ||
              (record.meal_type
                ? `${getMealTypeEmoji(record.meal_type)} ${getMealTypeLabel(record.meal_type)}`
                : '一顿餐')}
          </h1>
        </div>

        {/* 金额 */}
        {record.amount != null && (
          <div className="mb-3 text-2xl font-semibold text-primary">
            {formatMoneyShort(record.amount, record.currency)}
          </div>
        )}

        {/* 元信息 */}
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={14} />
            {formatDateTime(record.occurred_at)}
          </div>
          {record.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} />
              {record.location}
            </div>
          )}
        </div>

        {/* 标签 */}
        {record.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {record.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                style={tag.color ? { backgroundColor: tag.color + '33' } : undefined}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* 备注 */}
        {record.note && (
          <div className="mb-4 rounded-xl border border-border bg-card p-3">
            <p className="text-sm leading-relaxed text-foreground">{record.note}</p>
          </div>
        )}

        {/* 底部元信息 */}
        <div className="space-y-0.5 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">
            创建于 {formatDateTime(record.created_at)}
          </p>
          {record.updated_at !== record.created_at && (
            <p className="text-xs text-muted-foreground">
              更新于 {formatDateTime(record.updated_at)}
            </p>
          )}
        </div>
      </div>
    </PageShell>
  )
}
