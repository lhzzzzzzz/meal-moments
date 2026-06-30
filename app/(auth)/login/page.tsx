import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { GuestLoginButton } from './guest-login-button'
import { getTranslator } from '@/lib/i18n/get-locale'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator()
  return { title: `${t('login.title')} - Meal Moments` }
}

export default async function LoginPage() {
  const { t } = await getTranslator()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">🍽️</div>
          <h1 className="text-2xl font-semibold text-foreground">{t('login.heading')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('login.subtitle')}</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <div className="mt-4">
          <GuestLoginButton />
        </div>
      </div>
    </div>
  )
}
