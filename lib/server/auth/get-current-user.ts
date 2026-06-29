import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { cache } from 'react'

// React.cache() 保证同一 render pass 内无论被调用多少次（layout、page、子组件）
// 只发起一次 Supabase Auth 网络请求。
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export async function getCurrentUserOrNull() {
  try {
    return await getCurrentUser()
  } catch {
    return null
  }
}
