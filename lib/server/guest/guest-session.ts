import { cookies } from 'next/headers'

export const GUEST_MODE_COOKIE = 'guest_mode'

export async function isGuestMode(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(GUEST_MODE_COOKIE)?.value === '1'
}

export async function setGuestMode(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(GUEST_MODE_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearGuestMode(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(GUEST_MODE_COOKIE)
}
