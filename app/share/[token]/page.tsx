import { getShareLinkByToken } from '@/lib/server/db/share-links'
import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'
import { getTranslator } from '@/lib/i18n/get-locale'
import { ShareFeed } from './share-feed'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const { t } = await getTranslator()
  const shareLink = await getShareLinkByToken(token)
  if (!shareLink) return { title: `${t('share.invalidTitle')} - Meal Moments` }

  const admin = createSupabaseAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('display_name, share_title, share_description')
    .eq('id', shareLink.user_id)
    .single()

  return {
    title:
      profile?.share_title ??
      `${profile?.display_name ?? ''}${t('share.lifeRecordsSuffix')}`,
    description: profile?.share_description ?? t('meta.description'),
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const { t } = await getTranslator()
  const shareLink = await getShareLinkByToken(token)

  if (!shareLink) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-3xl">🔒</p>
          <h1 className="mt-3 text-lg font-semibold">{t('share.invalidLink')}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t('share.linkExpiredHint')}</p>
        </div>
      </div>
    )
  }

  const admin = createSupabaseAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('display_name, share_title, share_description')
    .eq('id', shareLink.user_id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[480px] px-4">
        <div className="py-6 text-center">
          <div className="text-3xl">🍽️</div>
          <h1 className="mt-2 text-xl font-semibold text-foreground">
            {profile?.share_title ??
              `${profile?.display_name ?? ''}${t('share.lifeRecordsSuffix')}`}
          </h1>
          {profile?.share_description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.share_description}
            </p>
          )}
        </div>

        <ShareFeed token={token} userId={shareLink.user_id} />

        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">{t('share.poweredBy')}</p>
        </div>
      </div>
    </div>
  )
}
