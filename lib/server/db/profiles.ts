import { createSupabaseServerClient } from '@/lib/server/supabase/server'

export async function getUserTimezone(userId: string): Promise<string> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('timezone')
    .eq('id', userId)
    .single()
  return data?.timezone ?? 'Australia/Melbourne'
}
