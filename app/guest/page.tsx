import { PageShell } from '@/components/layout/page-shell'
import { PlazaFeed } from '@/components/plaza/plaza-feed'
import { getTranslator } from '@/lib/i18n/get-locale'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator()
  return { title: `${t('plaza.title')} - Meal Moments` }
}

export default async function GuestPage() {
  const { t } = await getTranslator()

  return (
    <PageShell nav="guest">
      <div className="py-6">
        <div className="mb-5">
          <p className="text-sm text-muted-foreground">{t('plaza.subtitle')}</p>
          <h1 className="text-2xl font-semibold text-foreground">{t('plaza.title')}</h1>
        </div>
        <PlazaFeed />
      </div>
    </PageShell>
  )
}
