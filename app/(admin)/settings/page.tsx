import { PageShell } from '@/components/layout/page-shell'
import { getCurrentUser } from '@/lib/server/auth/get-current-user'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { getOrCreateShareLink } from '@/lib/server/db/share-links'
import { getTranslator } from '@/lib/i18n/get-locale'
import { SettingsForm } from './settings-form'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator()
  return { title: `${t('settings.title')} - Meal Moments` }
}

export default async function SettingsPage() {
  const user = await getCurrentUser()
  const { t } = await getTranslator()
  const supabase = await createSupabaseServerClient()

  const [profileResult, shareLink] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single(),
    getOrCreateShareLink(user!.id),
  ])

  const profile = profileResult.data

  return (
    <PageShell>
      <div className="py-5">
        <h1 className="mb-5 text-xl font-semibold">{t('settings.title')}</h1>
        <SettingsForm
          profile={profile}
          shareLink={shareLink}
          appUrl={process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}
        />
      </div>
    </PageShell>
  )
}
