import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import type { Locale } from '@/lib/i18n/config'
import type { Translator } from '@/lib/i18n/t'

function dateFnsLocale(locale: Locale) {
  return locale === 'zh' ? zhCN : enUS
}

function dateFormat(locale: Locale, withYear: boolean) {
  if (locale === 'zh') {
    return withYear ? 'yyyy年M月d日 HH:mm' : 'M月d日 HH:mm'
  }
  return withYear ? 'MMM d, yyyy HH:mm' : 'MMM d HH:mm'
}

function dateOnlyFormat(locale: Locale) {
  return locale === 'zh' ? 'M月d日' : 'MMM d'
}

export function formatDateGroup(
  dateStr: string,
  locale: Locale,
  t: Translator
): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return t('dates.today')
  if (isYesterday(date)) return t('dates.yesterday')
  if (isThisWeek(date, { weekStartsOn: 1 })) return t('dates.earlierThisWeek')
  return format(date, dateOnlyFormat(locale), { locale: dateFnsLocale(locale) })
}

export function formatDateTime(dateStr: string, locale: Locale): string {
  return format(parseISO(dateStr), dateFormat(locale, true), {
    locale: dateFnsLocale(locale),
  })
}

export function formatDateShort(dateStr: string, locale: Locale): string {
  return format(parseISO(dateStr), dateFormat(locale, false), {
    locale: dateFnsLocale(locale),
  })
}

export function formatDateOnly(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy-MM-dd')
}

export function formatTimeOnly(dateStr: string): string {
  return format(parseISO(dateStr), 'HH:mm')
}

export function formatRelativeDate(
  dateStr: string,
  locale: Locale,
  t: Translator
): string {
  const date = parseISO(dateStr)
  if (isToday(date)) {
    return t('dates.todayAt', { time: format(date, 'HH:mm') })
  }
  if (isYesterday(date)) {
    return t('dates.yesterdayAt', { time: format(date, 'HH:mm') })
  }
  return format(date, dateFormat(locale, false), { locale: dateFnsLocale(locale) })
}
