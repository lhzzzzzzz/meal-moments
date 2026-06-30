import { redirect } from 'next/navigation'
import { getCurrentUserOrNull } from '@/lib/server/auth/get-current-user'

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUserOrNull()
  if (user) {
    redirect('/admin')
  }

  return <>{children}</>
}
