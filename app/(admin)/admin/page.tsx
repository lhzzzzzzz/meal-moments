import { Suspense } from 'react'
import { PageShell } from '@/components/layout/page-shell'
import { getCurrentUser } from '@/lib/server/auth/get-current-user'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { PlazaFeed } from '@/components/plaza/plaza-feed'
import { TodaySummary } from './today-summary'
import { getTranslator } from '@/lib/i18n/get-locale'
import { Skeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Meal Moments' }
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  const { t } = await getTranslator()
  const supabase = await createSupabaseServerClient()
  const { data: profileData } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user!.id)
    .single()

  const profile = profileData as { display_name: string } | null
  const displayName = profile?.display_name ?? t('common.you')
  const hour = new Date().getHours()
  const greeting =
    hour < 6
      ? t('home.greetingLateNight')
      : hour < 12
        ? t('home.greetingMorning')
        : hour < 18
          ? t('home.greetingAfternoon')
          : t('home.greetingEvening')

  return (
    <PageShell>
      <div className="py-6">
        <div className="mb-5">
          <p className="text-sm text-muted-foreground">{greeting}，</p>
          <h1 className="text-2xl font-semibold text-foreground">{displayName}</h1>
        </div>

        <Suspense fallback={<Skeleton className="h-24 w-full rounded-xl" />}>
          <TodaySummary userId={user!.id} />
        </Suspense>

        <div className="mt-6">
          <h2 className="mb-3 text-base font-medium text-foreground">
            {t('home.communityPlaza')}
          </h2>
          <Suspense fallback={<PlazaFeedSkeleton />}>
            <PlazaFeed currentUserId={user!.id} />
          </Suspense>
        </div>
      </div>
    </PageShell>
  )
}

function PlazaFeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  )
}
