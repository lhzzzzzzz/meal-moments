import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'
import type { DbShareLink } from '@/types/record'
import { randomBytes } from 'crypto'

function generateToken(): string {
  return randomBytes(24).toString('hex')
}

export async function getShareLinkByUserId(
  userId: string
): Promise<DbShareLink | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('share_links')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getOrCreateShareLink(userId: string): Promise<DbShareLink> {
  const existing = await getShareLinkByUserId(userId)
  if (existing) return existing

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('share_links')
    .insert({ user_id: userId, token: generateToken(), is_enabled: true })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function regenerateToken(userId: string): Promise<DbShareLink> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('share_links')
    .update({ token: generateToken() })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateShareEnabled(
  userId: string,
  isEnabled: boolean
): Promise<DbShareLink> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('share_links')
    .update({ is_enabled: isEnabled })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * 通过 token 查找 share_link，使用 admin client 绕过 RLS。
 * 这是 MVP 中唯一允许服务端主动使用 admin client 读取业务数据的接口。
 */
export async function getShareLinkByToken(
  token: string
): Promise<DbShareLink | null> {
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from('share_links')
    .select('*')
    .eq('token', token)
    .eq('is_enabled', true)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}
