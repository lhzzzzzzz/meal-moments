import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { updateShareEnabled } from '@/lib/server/db/share-links'

export async function PATCH(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const body = await request.json()
  const { isEnabled } = body

  if (typeof isEnabled !== 'boolean') {
    return NextResponse.json(
      { data: null, error: { message: '参数有误' } },
      { status: 400 }
    )
  }

  try {
    const shareLink = await updateShareEnabled(user.id, isEnabled)
    return NextResponse.json({ data: shareLink, error: null })
  } catch {
    return NextResponse.json(
      { data: null, error: { message: '操作失败' } },
      { status: 500 }
    )
  }
}
