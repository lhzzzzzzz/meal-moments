import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDateGroup(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return '今天'
  if (isYesterday(date)) return '昨天'
  if (isThisWeek(date, { weekStartsOn: 1 })) return '本周较早时候'
  return format(date, 'M月d日', { locale: zhCN })
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy年M月d日 HH:mm', { locale: zhCN })
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'M月d日 HH:mm', { locale: zhCN })
}

export function formatDateOnly(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy-MM-dd')
}

export function formatTimeOnly(dateStr: string): string {
  return format(parseISO(dateStr), 'HH:mm')
}

export function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return `今天 ${format(date, 'HH:mm')}`
  if (isYesterday(date)) return `昨天 ${format(date, 'HH:mm')}`
  return format(date, 'M月d日 HH:mm', { locale: zhCN })
}
