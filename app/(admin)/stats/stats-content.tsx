'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatMoneyShort } from '@/lib/shared/formatters/format-money'
import { getMealTypeLabel } from '@/lib/shared/constants/meal-types'
import type { StatsResponse } from '@/types/api'

const PRESET_OPTIONS = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: '3months', label: '近 3 月' },
]

const CHART_COLORS = ['#3F7D58', '#E86F51', '#F6D78B', '#A9C7E8', '#EFB4B8', '#B8E8B4', '#D4B8E8']

interface StatsContentProps {
  initialStats: StatsResponse
  userId: string
}

export function StatsContent({ initialStats }: StatsContentProps) {
  const [stats, setStats] = useState<StatsResponse>(initialStats)
  const [preset, setPreset] = useState('month')
  const [loading, setLoading] = useState(false)

  async function handlePresetChange(newPreset: string) {
    setPreset(newPreset)
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/stats?preset=${newPreset}`)
      const json = await res.json()
      if (json.data) setStats(json.data)
    } finally {
      setLoading(false)
    }
  }

  const mealTypeData = Object.entries(stats.amountByMealType).map(([key, value]) => ({
    name: getMealTypeLabel(key),
    value,
  }))

  const tagData = Object.entries(stats.recordsByTag)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className={loading ? 'opacity-60 transition-opacity' : ''}>
      {/* 切换周期 */}
      <div className="mb-5 flex rounded-xl border border-border bg-card p-1">
        {PRESET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handlePresetChange(opt.value)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              preset === opt.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 汇总卡片 */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <SummaryCard
          label="总花费"
          value={formatMoneyShort(stats.totalAmount) || formatMoneyShort(0)}
          color="text-primary"
        />
        <SummaryCard label="记录数" value={`${stats.recordCount} 条`} />
        <SummaryCard label="记录天数" value={`${stats.activeDays} 天`} />
      </div>

      {/* 每日花费柱状图 */}
      {stats.dailyAmount.length > 0 && (
        <div className="mb-5 rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium">每日花费</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={stats.dailyAmount} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E3DA" />
              <XAxis
                dataKey="date"
                tickFormatter={(v: string) => v.slice(5)}
                tick={{ fontSize: 10, fill: '#6F6E68' }}
              />
              <YAxis tick={{ fontSize: 10, fill: '#6F6E68' }} />
              <Tooltip
                formatter={(value) => [formatMoneyShort(Number(value)), '花费']}
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="amount" fill="#3F7D58" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 餐别占比 */}
      {mealTypeData.length > 0 && (
        <div className="mb-5 rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium">餐别花费占比</p>
          <div className="flex items-center gap-4">
            <PieChart width={100} height={100}>
              <Pie
                data={mealTypeData}
                cx={50}
                cy={50}
                innerRadius={28}
                outerRadius={48}
                paddingAngle={2}
                dataKey="value"
              >
                {mealTypeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex-1 space-y-1.5">
              {mealTypeData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-medium">{formatMoneyShort(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 标签统计 */}
      {tagData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium">标签频率</p>
          <div className="space-y-2">
            {tagData.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-medium">{count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.recordCount === 0 && (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">该时间段暂无数据</p>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <p className={`text-base font-semibold ${color ?? 'text-foreground'}`}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
