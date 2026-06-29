import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { getTagsByUser, createTag } from '@/lib/server/db/tags'

export async function GET() {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  try {
    const tags = await getTagsByUser(user.id)
    return NextResponse.json({ data: tags, error: null })
  } catch {
    return NextResponse.json(
      { data: null, error: { message: '获取标签失败' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { name, color } = await request.json()
  if (!name) {
    return NextResponse.json(
      { data: null, error: { message: '标签名不能为空' } },
      { status: 400 }
    )
  }

  try {
    const tag = await createTag(user.id, name, color)
    return NextResponse.json({ data: tag, error: null }, { status: 201 })
  } catch {
    return NextResponse.json(
      { data: null, error: { message: '创建标签失败' } },
      { status: 500 }
    )
  }
}
