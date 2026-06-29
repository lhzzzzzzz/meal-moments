import { Suspense } from 'react'
import { LoginForm } from './login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登录 - Meal Moments',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">🍽️</div>
          <h1 className="text-2xl font-semibold text-foreground">
            回到你的生活记录
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            登录后记录每日饮食，分享给在意的人
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
