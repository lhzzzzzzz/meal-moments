import type { Dictionary } from './types'

export type Translator = (
  key: string,
  params?: Record<string, string | number>
) => string

export function createTranslator(dictionary: Dictionary): Translator {
  return function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.')
    let value: unknown = dictionary
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    if (typeof value !== 'string') return key
    if (!params) return value
    return value.replace(/\{(\w+)\}/g, (_, name: string) =>
      String(params[name] ?? `{${name}}`)
    )
  }
}

export function translateError(
  t: Translator,
  error?: { code?: string; message?: string } | null
): string {
  if (!error) return t('errors.GENERIC')
  if (error.code) {
    const key = `errors.${error.code}`
    const translated = t(key)
    if (translated !== key) return translated
  }
  return error.message ?? t('errors.GENERIC')
}
