'use server'

import { redirect } from 'next/navigation'
import { setGuestMode } from '@/lib/server/guest/guest-session'

export async function enterGuestMode() {
  await setGuestMode()
  redirect('/guest')
}
