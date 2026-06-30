import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import { formatMoneyShort } from '@/lib/shared/formatters/format-money'
import { CURRENCY_VALUES } from '@/lib/shared/validators/record'
import { getTranslator } from '@/lib/i18n/get-locale'

interface TodaySummaryProps {
  userId: string
}

function sumByCurrency(
  records: { amount: number | null; currency: string }[]
) {
  const totals = new Map<string, number>()
  for (const r of records) {
    if (r.amount == null || r.amount <= 0) continue
    totals.set(r.currency, (totals.get(r.currency) ?? 0) + r.amount)
  }
  return CURRENCY_VALUES.filter((c) => totals.has(c)).map((currency) => ({
    currency,
    total: totals.get(currency)!,
  }))
}

export async function TodaySummary({ userId }: TodaySummaryProps) {
  const { t } = await getTranslator()
  const supabase = await createSupabaseServerClient()

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
    .select('amount, currency, occurred_at')
    .eq('user_id', userId)
    .gte('occurred_at', startOfDay)
    .lte('occurred_at', endOfDay)

  const todayRecords = (todayRecordsRaw ?? []) as {
    amount: number | null
    currency: string
  }[]
  const count = todayRecords.length
  const spendingByCurrency = sumByCurrency(todayRecords)

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        {t('todaySummary.title')}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold text-foreground">{count}</p>
          <p className="text-xs text-muted-foreground">{t('todaySummary.recordCount')}</p>
        </div>
        <div>
          {spendingByCurrency.length === 0 ? (
            <p className="text-2xl font-semibold text-primary">—</p>
          ) : spendingByCurrency.length === 1 ? (
            <p className="text-2xl font-semibold text-primary">
              {formatMoneyShort(
                spendingByCurrency[0].total,
                spendingByCurrency[0].currency
              )}
            </p>
          ) : (
            <div className="space-y-0.5">
              {spendingByCurrency.map(({ currency, total }) => (
                <p
                  key={currency}
                  className="text-xl font-semibold leading-tight text-primary"
                >
                  {formatMoneyShort(total, currency)}
                </p>
              ))}
            </div>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {t('todaySummary.todaySpending')}
          </p>
        </div>
      </div>
    </div>
  )
}
