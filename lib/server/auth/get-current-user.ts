import { createSupabaseServerClient } from '@/lib/server/supabase/server'

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserOrNull() {
  try {
    return await getCurrentUser()
  } catch {
    return null
  }
}
