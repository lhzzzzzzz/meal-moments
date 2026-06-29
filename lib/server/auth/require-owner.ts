import { NextResponse } from 'next/server'
import { getCurrentUser } from './get-current-user'
import type { User } from '@supabase/supabase-js'

/**
 * 用于 Route Handler：要求登录，否则返回 401。
 * 使用方式：
 *   const { user, errorResponse } = await requireOwner()
 *   if (errorResponse) return errorResponse
 */
export async function requireOwner(): Promise<
  { user: User; errorResponse: null } | { user: null; errorResponse: NextResponse }
> {
  const user = await getCurrentUser()
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { data: null, error: { message: '未登录', code: 'UNAUTHORIZED' } },
        { status: 401 }
      ),
    }
  }
  return { user, errorResponse: null }
}
