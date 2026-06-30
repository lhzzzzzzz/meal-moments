'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { useT } from '@/components/i18n/locale-provider'
import { enterGuestMode } from './actions'

export function GuestLoginButton() {
  const t = useT()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={pending}
      onClick={() => startTransition(() => enterGuestMode())}
    >
      {pending ? t('login.guestEntering') : t('login.guestBrowse')}
    </Button>
  )
}
