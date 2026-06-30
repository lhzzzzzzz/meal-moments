import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from './config'
import { getDictionary } from './dictionaries'
import { createTranslator, type Translator } from './t'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE)?.value
  if (value && isLocale(value)) return value
  return DEFAULT_LOCALE
}

export async function getTranslator(): Promise<{
  locale: Locale
  t: Translator
}> {
  const locale = await getLocale()
  const dictionary = getDictionary(locale)
  return { locale, t: createTranslator(dictionary) }
}
