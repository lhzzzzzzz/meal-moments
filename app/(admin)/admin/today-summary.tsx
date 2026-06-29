import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { formatMoneyShort } from '@/lib/shared/formatters/format-money'

interface TodaySummaryProps {
  userId: string
}

export async function TodaySummary({ userId }: TodaySummaryProps) {
  const supabase = await createSupabaseServerClient()

  // 获取 Sydney 时区今日范围
  const now = new Date()
  const sydneyDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)

  const startOfDay = new Date(`${sydneyDate}T00:00:00+10:00`).toISOString()
  const endOfDay = new Date(`${sydneyDate}T23:59:59+10:00`).toISOString()

  const { data: todayRecordsRaw } = await supabase
    .from('records')
    .select('amount, occurred_at')
    .eq('user_id', userId)
    .gte('occurred_at', startOfDay)
    .lte('occurred_at', endOfDay)

  const todayRecords = (todayRecordsRaw ?? []) as { amount: number | null }[]
  const count = todayRecords.length
  const totalAmount = todayRecords.reduce(
    (sum, r) => sum + (r.amount ?? 0),
    0
  )

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-sm font-medium text-muted-foreground">今日摘要</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold text-foreground">{count}</p>
          <p className="text-xs text-muted-foreground">条记录</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-primary">
            {totalAmount > 0 ? formatMoneyShort(totalAmount) : '—'}
          </p>
          <p className="text-xs text-muted-foreground">饮食花费</p>
        </div>
      </div>
    </div>
  )
}
