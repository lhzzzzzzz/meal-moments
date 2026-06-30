import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { createUpdateProfileSchema } from '@/lib/shared/validators/share'
import { getTranslator } from '@/lib/i18n/get-locale'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'

export async function PATCH(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { t } = await getTranslator()
  const body = await request.json()
  const parsed = createUpdateProfileSchema(t).safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { code: 'INVALID_PARAMS', message: 'INVALID_PARAMS' } },
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
      { data: null, error: { code: 'SAVE_PROFILE_FAILED', message: 'SAVE_PROFILE_FAILED' } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { ok: true }, error: null })
}
