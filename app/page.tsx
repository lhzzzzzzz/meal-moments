import { redirect } from 'next/navigation'
import { getCurrentUserOrNull } from '@/lib/server/auth/get-current-user'
import { isGuestMode } from '@/lib/server/guest/guest-session'

export default async function RootPage() {
  const user = await getCurrentUserOrNull()
  if (user) {
    redirect('/admin')
  }

  if (await isGuestMode()) {
    redirect('/guest')
  }

  redirect('/login')
}
