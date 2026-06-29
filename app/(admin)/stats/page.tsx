import { Suspense } from 'react'
import { PageShell } from '@/components/layout/page-shell'
import { getCurrentUser } from '@/lib/server/auth/get-current-user'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { getStats } from '@/lib/server/db/stats'
import { StatsContent } from './stats-content'
import { Skeleton } from '@/components/ui/skeleton'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '饮食统计 - Meal Moments',
}

export default async function StatsPage() {
  const user = await getCurrentUser()

  return (
    <PageShell>
      <div className="py-5">
        <h1 className="mb-5 text-xl font-semibold">饮食统计</h1>
        <Suspense fallback={<StatsSkeleton />}>
          <StatsLoader userId={user!.id} />
        </Suspense>
      </div>
    </PageShell>
  )
}

async function StatsLoader({ userId }: { userId: string }) {
  const supabase = await createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('timezone')
    .eq('id', userId)
    .single()
  const timezone = profile?.timezone ?? 'Australia/Sydney'

  const now = new Date()
  const startDate = format(startOfMonth(now), "yyyy-MM-dd'T'00:00:00xxx")
  const endDate = format(endOfMonth(now), "yyyy-MM-dd'T'23:59:59xxx")

  const stats = await getStats(userId, startDate, endDate, timezone)

  return <StatsContent initialStats={stats} userId={userId} />
}

function StatsSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-36 w-full rounded-xl" />
    </div>
  )
}
