import type { MealType } from '@/types/record'
import type { Translator } from '@/lib/i18n/t'

export const MEAL_TYPE_VALUES = [
  'breakfast',
  'lunch',
  'dinner',
  'midnight_snack',
  'snack',
  'drink',
  'other',
] as const

export const MEAL_TYPE_EMOJI: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  midnight_snack: '🌃',
  snack: '🍪',
  drink: '🧋',
  other: '🍽️',
}

export function getMealTypes(t: Translator) {
  return MEAL_TYPE_VALUES.map((value) => ({
    value,
    label: t(`mealTypes.${value}`),
    emoji: MEAL_TYPE_EMOJI[value],
  }))
}

export function getMealTypeLabel(value: string, t: Translator): string {
  const key = `mealTypes.${value}`
  const label = t(key)
  return label !== key ? label : value
}

export function getMealTypeEmoji(value: string): string {
  return MEAL_TYPE_EMOJI[value as MealType] ?? '🍽️'
}
