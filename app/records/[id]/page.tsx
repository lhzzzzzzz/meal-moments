import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Pencil, MapPin, Clock } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { DeleteRecordButton } from './delete-record-button'
import { getCurrentUserOrNull } from '@/lib/server/auth/get-current-user'
import { getRecordById } from '@/lib/server/db/records'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { getMealTypeLabel, getMealTypeEmoji } from '@/lib/shared/constants/meal-types'
import { getMoodLabel, getMoodEmoji } from '@/lib/shared/constants/moods'
import { formatMoneyShort } from '@/lib/shared/formatters/format-money'
import { formatDateTime } from '@/lib/shared/formatters/format-date'
import { getTranslator } from '@/lib/i18n/get-locale'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { t } = await getTranslator()
  const user = await getCurrentUserOrNull()
  if (!user) return { title: `${t('record.recordDetail')} - Meal Moments` }
  const record = await getRecordById(id)
  return {
    title: record?.title
      ? `${record.title} - Meal Moments`
      : `${t('record.recordDetail')} - Meal Moments`,
  }
}

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { locale, t } = await getTranslator()
  const user = await getCurrentUserOrNull()
  if (!user) notFound()

  const record = await getRecordById(id)
  if (!record) notFound()

  const isOwner = user.id === record.user_id
  const sortedImages = [...record.images].sort((a, b) => a.sort_order - b.sort_order)

  let authorName: string | null = null
  if (!isOwner) {
    const supabase = await createSupabaseServerClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', record.user_id)
      .single()
    authorName = profile?.display_name ?? null
  }

  return (
    <PageShell>
      <div className="py-5">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t('common.back')}
          >
            <ArrowLeft size={18} />
          </Link>
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/records/${id}/edit`}
                className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label={t('common.edit')}
              >
                <Pencil size={14} />
                {t('common.edit')}
              </Link>
              <DeleteRecordButton recordId={id} />
            </div>
          )}
        </div>

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
                  alt={t('record.imageAlt', {
                    title: record.title || t('record.aMeal'),
                    n: idx + 1,
                  })}
                  fill
                  className="object-cover"
                  sizes="(max-width: 480px) 100vw, 480px"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mb-3">
          {!isOwner && authorName && (
            <p className="mb-1 text-sm font-medium text-primary">{authorName}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {record.meal_type && (
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
                {getMealTypeEmoji(record.meal_type)}{' '}
                {getMealTypeLabel(record.meal_type, t)}
              </span>
            )}
            {record.mood && (
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
                {getMoodEmoji(record.mood)} {getMoodLabel(record.mood, t)}
              </span>
            )}
            {!record.is_shared && isOwner && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                {t('record.privateOnly')}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-xl font-semibold text-foreground">
            {record.title ||
              (record.meal_type
                ? `${getMealTypeEmoji(record.meal_type)} ${getMealTypeLabel(record.meal_type, t)}`
                : t('record.aMeal'))}
          </h1>
        </div>

        {record.amount != null && (
          <div className="mb-3 text-2xl font-semibold text-primary">
            {formatMoneyShort(record.amount, record.currency)}
          </div>
        )}

        <div className="mb-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={14} />
            {formatDateTime(record.occurred_at, locale)}
          </div>
          {record.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} />
              {record.location}
            </div>
          )}
        </div>

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

        {record.note && (
          <div className="mb-4 rounded-xl border border-border bg-card p-3">
            <p className="text-sm leading-relaxed text-foreground">{record.note}</p>
          </div>
        )}

        <div className="space-y-0.5 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">
            {t('common.createdAt')} {formatDateTime(record.created_at, locale)}
          </p>
          {record.updated_at !== record.created_at && (
            <p className="text-xs text-muted-foreground">
              {t('common.updatedAt')} {formatDateTime(record.updated_at, locale)}
            </p>
          )}
        </div>
      </div>
    </PageShell>
  )
}
