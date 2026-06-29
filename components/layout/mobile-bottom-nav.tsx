'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: '首页', icon: Home },
  { href: '/admin/new', label: '记录', icon: PlusCircle, isPrimary: true },
  { href: '/stats', label: '统计', icon: BarChart2 },
  { href: '/settings', label: '设置', icon: Settings },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-safe">
      <div className="mx-auto flex max-w-[480px] items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon, isPrimary }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
                isPrimary
                  ? 'text-primary'
                  : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={label}
            >
              <Icon
                size={isPrimary ? 28 : 22}
                className={cn(isPrimary && 'drop-shadow-sm')}
                strokeWidth={isPrimary ? 2 : 1.75}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
