export const LOCALES = ['zh', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'zh'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function localeToHtmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en'
}
