'use server'

import { clearGuestMode } from '@/lib/server/guest/guest-session'

export async function clearGuestModeAction() {
  await clearGuestMode()
}
