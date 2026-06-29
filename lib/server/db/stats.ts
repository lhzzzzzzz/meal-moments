import { createSupabaseServerClient } from '@/lib/server/supabase/server'
import type { StatsResponse } from '@/types/api'

export async function getStats(
  userId: string,
  startDate: string,
  endDate: string,
  timezone = 'Australia/Sydney'
): Promise<StatsResponse> {
  const supabase = await createSupabaseServerClient()

  const { data: records, error } = await supabase
    .from('records')
    .select(
      `
      id, amount, meal_type, occurred_at,
      record_tags(tag_id, tags(name))
    `
    )
    .eq('user_id', userId)
    .gte('occurred_at', startDate)
    .lte('occurred_at', endDate)

  if (error) throw error

  const list = records ?? []

  let totalAmount = 0
  const amountByMealType: Record<string, number> = {}
  const recordsByTag: Record<string, number> = {}
  const dailyMap: Record<string, number> = {}
  const activeDaySet = new Set<string>()

  for (const r of list as any[]) {
    // 按时区换算日期
    const localDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(r.occurred_at))

    activeDaySet.add(localDate)

    if (r.amount) {
      totalAmount += r.amount
      amountByMealType[r.meal_type] =
        (amountByMealType[r.meal_type] ?? 0) + r.amount
      dailyMap[localDate] = (dailyMap[localDate] ?? 0) + r.amount
    }

    for (const rt of r.record_tags ?? []) {
      const tagName = rt.tags?.name
      if (tagName) {
        recordsByTag[tagName] = (recordsByTag[tagName] ?? 0) + 1
      }
    }
  }

  const dailyAmount = Object.entries(dailyMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    recordCount: list.length,
    activeDays: activeDaySet.size,
    amountByMealType,
    recordsByTag,
    dailyAmount,
  }
}
