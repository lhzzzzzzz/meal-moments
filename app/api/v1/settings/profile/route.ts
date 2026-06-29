import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { updateProfileSchema } from '@/lib/shared/validators/share'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'

export async function PATCH(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const body = await request.json()
  const parsed = updateProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { message: '参数有误' } },
      { status: 400 }
    )
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: parsed.data.displayName,
      share_title: parsed.data.shareTitle ?? null,
      share_description: parsed.data.shareDescription ?? null,
    })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json(
      { data: null, error: { message: '保存失败' } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { ok: true }, error: null })
}
