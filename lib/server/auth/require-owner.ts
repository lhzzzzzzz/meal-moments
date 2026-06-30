import { NextResponse } from 'next/server'
import { getCurrentUser } from './get-current-user'
import type { User } from '@supabase/supabase-js'

export async function requireOwner(): Promise<
  { user: User; errorResponse: null } | { user: null; errorResponse: NextResponse }
> {
  const user = await getCurrentUser()
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { data: null, error: { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED' } },
        { status: 401 }
      ),
    }
  }
  return { user, errorResponse: null }
}
