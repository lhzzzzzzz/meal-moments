'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLocaleAction } from '@/app/actions/set-locale'
import { LOCALES, type Locale } from '@/lib/i18n/config'
import { useLocale } from '@/components/i18n/locale-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
}

export function LocaleSwitcher() {
  const { locale } = useLocale()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleChange(next: Locale | null) {
    if (!next || next === locale || pending) return
    startTransition(async () => {
      await setLocaleAction(next)
      router.refresh()
    })
  }

  return (
    <Select value={locale} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger id="locale-select" className="w-full">
        <SelectValue>{LOCALE_LABELS[locale]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start" side="bottom" alignItemWithTrigger={false}>
        {LOCALES.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {LOCALE_LABELS[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
