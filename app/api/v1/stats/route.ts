import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/server/auth/require-owner'
import { getStats } from '@/lib/server/db/stats'
import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export async function GET(request: NextRequest) {
  const { user, errorResponse } = await requireOwner()
  if (errorResponse) return errorResponse

  const { searchParams } = request.nextUrl
  const preset = searchParams.get('preset') ?? 'month'
  let startDate = searchParams.get('startDate')
  let endDate = searchParams.get('endDate')

  const supabase = await createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('timezone')
    .eq('id', user.id)
    .single()
  const timezone = profile?.timezone ?? 'Australia/Sydney'

  if (!startDate || !endDate) {
    const now = new Date()
    if (preset === 'week') {
      startDate = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd'T'00:00:00xxx")
      endDate = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd'T'23:59:59xxx")
    } else if (preset === '3months') {
      startDate = format(startOfMonth(subMonths(now, 2)), "yyyy-MM-dd'T'00:00:00xxx")
      endDate = format(endOfMonth(now), "yyyy-MM-dd'T'23:59:59xxx")
    } else {
      startDate = format(startOfMonth(now), "yyyy-MM-dd'T'00:00:00xxx")
      endDate = format(endOfMonth(now), "yyyy-MM-dd'T'23:59:59xxx")
    }
  }

  try {
    const stats = await getStats(user.id, startDate, endDate, timezone)
    return NextResponse.json({ data: stats, error: null })
  } catch (err) {
    console.error('[GET /api/v1/stats]', err)
    return NextResponse.json(
      { data: null, error: { code: 'FETCH_STATS_FAILED', message: 'FETCH_STATS_FAILED' } },
      { status: 500 }
    )
  }
}
