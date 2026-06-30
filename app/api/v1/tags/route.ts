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
      { data: null, error: { code: 'FETCH_TAGS_FAILED', message: 'FETCH_TAGS_FAILED' } },
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
      { data: null, error: { code: 'TAG_NAME_REQUIRED', message: 'TAG_NAME_REQUIRED' } },
      { status: 400 }
    )
  }

  try {
    const tag = await createTag(user.id, name, color)
    return NextResponse.json({ data: tag, error: null }, { status: 201 })
  } catch {
    return NextResponse.json(
      { data: null, error: { code: 'CREATE_TAG_FAILED', message: 'CREATE_TAG_FAILED' } },
      { status: 500 }
    )
  }
}
