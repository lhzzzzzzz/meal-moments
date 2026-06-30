'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecordCard } from '@/components/records/record-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocale, useT } from '@/components/i18n/locale-provider'
import { translateError } from '@/lib/i18n/t'
import { apiClient } from '@/lib/client/api-client'
import { HOME_FEED_PAGE_SIZE, type FeedScope } from '@/lib/shared/constants/feed'
import { groupRecordsByDate } from '@/lib/shared/group-records-by-date'
import { cn } from '@/lib/utils'
import type { PaginatedResponse } from '@/types/api'
import type { RecordListItem } from '@/types/record'

interface HomeFeedProps {
  userId: string
}

export function HomeFeed({ userId }: HomeFeedProps) {
  const { locale } = useLocale()
  const t = useT()
  const [scope, setScope] = useState<FeedScope>('mine')
  const [records, setRecords] = useState<RecordListItem[]>([])
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const scopeOptions = useMemo(
    () => [
      { value: 'mine' as FeedScope, label: t('home.scopeMine') },
      { value: 'community' as FeedScope, label: t('home.scopeCommunity') },
    ],
    [t]
  )

  const fetchPage = useCallback(
    async (page: number, replace: boolean) => {
      const result = await apiClient.get<PaginatedResponse<RecordListItem>>(
        `/records?scope=${scope}&page=${page}&pageSize=${HOME_FEED_PAGE_SIZE}`
      )

      if (result.error || !result.data) {
        throw new Error(translateError(t, result.error))
      }

      setRecords((prev) =>
        replace ? result.data!.records : [...prev, ...result.data!.records]
      )
      setNextPage(result.data.nextPage)
    },
    [scope, t]
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        await fetchPage(1, true)
      } catch {
        if (!cancelled) {
          setRecords([])
          setNextPage(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [fetchPage])

  async function handleLoadMore() {
    if (!nextPage || loadingMore) return
    setLoadingMore(true)
    try {
      await fetchPage(nextPage, false)
    } finally {
      setLoadingMore(false)
    }
  }

  const groups = groupRecordsByDate(records, locale, t)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-medium text-foreground">{t('home.recentRecords')}</h2>
        <div className="flex rounded-lg border border-border bg-muted p-0.5">
          {scopeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setScope(option.value)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                scope === option.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <FeedSkeleton />
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="text-3xl">{scope === 'mine' ? '🍽️' : '🌿'}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {scope === 'mine' ? t('record.emptyMine') : t('record.emptyCommunity')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(({ dateKey, label, items }) => (
            <div key={dateKey}>
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">{label}</h3>
              <div className="space-y-3">
                {items.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    isOwner={record.user_id === userId}
                    showAuthor={scope === 'community'}
                  />
                ))}
              </div>
            </div>
          ))}

          {nextPage && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('common.loadMore')
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  )
}
