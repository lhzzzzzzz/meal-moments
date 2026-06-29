import { redirect } from 'next/navigation'
import { getCurrentUserOrNull } from '@/lib/server/auth/get-current-user'

export default async function RootPage() {
  const user = await getCurrentUserOrNull()
  if (user) {
    redirect('/admin')
  } else {
    redirect('/login')
  }
}
