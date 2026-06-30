import type { Locale } from './config'
import type { Dictionary } from './types'
import zh from '@/messages/zh.json'
import en from '@/messages/en.json'

const dictionaries: Record<Locale, Dictionary> = {
  zh: zh as Dictionary,
  en: en as Dictionary,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
