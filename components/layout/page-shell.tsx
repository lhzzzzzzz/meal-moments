import { MobileBottomNav } from './mobile-bottom-nav'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  showNav?: boolean
  className?: string
}

export function PageShell({ children, showNav = true, className }: PageShellProps) {
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
      {showNav && <MobileBottomNav />}
    </div>
  )
}
