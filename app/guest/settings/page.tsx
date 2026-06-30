'use client'

import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from '@/components/i18n/locale-switcher'
import { useT } from '@/components/i18n/locale-provider'
import { clearGuestModeAction } from './actions'

export default function GuestSettingsPage() {
  const router = useRouter()
  const t = useT()

  async function handleLogin() {
    await clearGuestModeAction()
    router.push('/login')
    router.refresh()
  }

  return (
    <PageShell nav="guest">
      <div className="space-y-6 py-5">
        <h1 className="text-xl font-semibold">{t('settings.title')}</h1>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-4 text-sm font-semibold">{t('settings.language')}</h2>
          <LocaleSwitcher />
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <p className="mb-4 text-sm text-muted-foreground">{t('settings.guestHint')}</p>
          <Button className="w-full" onClick={handleLogin}>
            <LogIn size={16} className="mr-2" />
            {t('settings.loginAccount')}
          </Button>
        </section>
      </div>
    </PageShell>
  )
}
