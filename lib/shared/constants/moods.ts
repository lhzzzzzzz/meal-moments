import type { Mood } from '@/types/record'
import type { Translator } from '@/lib/i18n/t'

export const MOOD_VALUES = [
  'happy',
  'normal',
  'tired',
  'satisfied',
  'homesick',
  'busy',
  'other',
] as const

export const MOOD_EMOJI: Record<Mood, string> = {
  happy: '😊',
  normal: '😐',
  tired: '😴',
  satisfied: '😌',
  homesick: '🏠',
  busy: '⚡',
  other: '💭',
}

export function getMoods(t: Translator) {
  return MOOD_VALUES.map((value) => ({
    value,
    label: t(`moods.${value}`),
    emoji: MOOD_EMOJI[value],
  }))
}

export function getMoodLabel(value: string, t: Translator): string {
  const key = `moods.${value}`
  const label = t(key)
  return label !== key ? label : value
}

export function getMoodEmoji(value: string): string {
  return MOOD_EMOJI[value as Mood] ?? '💭'
}
