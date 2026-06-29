import { getShareLinkByToken } from '@/lib/server/db/share-links'
import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'
import { ShareFeed } from './share-feed'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const shareLink = await getShareLinkByToken(token)
  if (!shareLink) return { title: '分享链接无效 - Meal Moments' }

  const admin = createSupabaseAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('display_name, share_title, share_description')
    .eq('id', shareLink.user_id)
    .single()

  return {
    title: profile?.share_title ?? `${profile?.display_name ?? ''}的生活记录`,
    description: profile?.share_description ?? '记录每日饮食，分享给在意的人',
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const shareLink = await getShareLinkByToken(token)

  if (!shareLink) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-3xl">🔒</p>
          <h1 className="mt-3 text-lg font-semibold">这个分享链接暂时不可用。</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            链接可能已失效或被关闭。
          </p>
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
        {/* 顶部信息 */}
        <div className="py-6 text-center">
          <div className="text-3xl">🍽️</div>
          <h1 className="mt-2 text-xl font-semibold text-foreground">
            {profile?.share_title ?? `${profile?.display_name ?? ''}的生活记录`}
          </h1>
          {profile?.share_description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.share_description}
            </p>
          )}
        </div>

        {/* 分享生活流 */}
        <ShareFeed token={token} userId={shareLink.user_id} />

        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">由 Meal Moments 提供</p>
        </div>
      </div>
    </div>
  )
}
