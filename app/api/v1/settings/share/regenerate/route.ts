import { NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { regenerateToken } from '@/lib/server/db/share-links'

export async function POST() {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  try {
    const shareLink = await regenerateToken(user.id)
    return NextResponse.json({ data: { token: shareLink.token }, error: null })
  } catch {
    return NextResponse.json(
      { data: null, error: { message: '重新生成失败' } },
      { status: 500 }
    )
  }
}
