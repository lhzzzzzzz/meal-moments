'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings } from 'lucide-react'
import { useT } from '@/components/i18n/locale-provider'
import { cn } from '@/lib/utils'

export function GuestBottomNav() {
  const pathname = usePathname()
  const t = useT()

  const navItems = [
    { href: '/guest', label: t('nav.home'), icon: Home },
    { href: '/guest/settings', label: t('nav.settings'), icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-safe">
      <div className="mx-auto flex max-w-[480px] items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={label}
            >
              <Icon size={22} strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
