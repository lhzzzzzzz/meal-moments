import { Suspense } from 'react'
import { PageShell } from '@/components/layout/page-shell'
import { getCurrentUser } from '@/lib/server/auth/get-current-user'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { RecordList } from '@/components/records/record-list'
import { TodaySummary } from './today-summary'
import { Skeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meal Moments',
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  const supabase = await createSupabaseServerClient()
  const { data: profileData } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user!.id)
    .single()

  const profile = profileData as { display_name: string } | null
  const displayName = profile?.display_name ?? '你'
  const hour = new Date().getHours()
  const greeting =
    hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'

  return (
    <PageShell>
      <div className="py-6">
        {/* 顶部问候 */}
        <div className="mb-5">
          <p className="text-sm text-muted-foreground">{greeting}，</p>
          <h1 className="text-2xl font-semibold text-foreground">{displayName}</h1>
        </div>

        {/* 今日摘要 */}
        <Suspense fallback={<Skeleton className="h-24 w-full rounded-xl" />}>
          <TodaySummary userId={user!.id} />
        </Suspense>

        {/* 生活流 */}
        <div className="mt-6">
          <h2 className="mb-3 text-base font-medium text-foreground">最近记录</h2>
          <Suspense fallback={<RecordListSkeleton />}>
            <RecordList userId={user!.id} isOwner />
          </Suspense>
        </div>
      </div>
    </PageShell>
  )
}

function RecordListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  )
}
