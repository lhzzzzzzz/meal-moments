import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import type { DbTag } from '@/types/record'

export async function getTagsByUser(userId: string): Promise<DbTag[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createTag(
  userId: string,
  name: string,
  color?: string
): Promise<DbTag> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('tags')
    .insert({ user_id: userId, name, color: color ?? null })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTag(id: string, userId: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}
