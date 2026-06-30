import { MobileBottomNav } from './mobile-bottom-nav'
import { GuestBottomNav } from './guest-bottom-nav'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  showNav?: boolean
  nav?: 'default' | 'guest'
  className?: string
}

export function PageShell({
  children,
  showNav = true,
  nav = 'default',
  className,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <main
        className={cn(
          'mx-auto max-w-[480px] px-4',
          showNav && 'pb-24',
          className
        )}
      >
        {children}
      </main>
      {showNav && (nav === 'guest' ? <GuestBottomNav /> : <MobileBottomNav />)}
    </div>
  )
}
