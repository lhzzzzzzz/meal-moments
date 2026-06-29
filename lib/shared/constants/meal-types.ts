import type { MealType } from '@/types/record'

export const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: '早餐', emoji: '🌅' },
  { value: 'lunch', label: '午餐', emoji: '☀️' },
  { value: 'dinner', label: '晚餐', emoji: '🌙' },
  { value: 'midnight_snack', label: '夜宵', emoji: '🌃' },
  { value: 'snack', label: '零食', emoji: '🍪' },
  { value: 'drink', label: '饮品', emoji: '🧋' },
  { value: 'other', label: '其他', emoji: '🍽️' },
]

export const MEAL_TYPE_MAP: Record<MealType, { label: string; emoji: string }> =
  Object.fromEntries(
    MEAL_TYPES.map(({ value, label, emoji }) => [value, { label, emoji }])
  ) as Record<MealType, { label: string; emoji: string }>

export function getMealTypeLabel(value: string): string {
  return MEAL_TYPE_MAP[value as MealType]?.label ?? value
}

export function getMealTypeEmoji(value: string): string {
  return MEAL_TYPE_MAP[value as MealType]?.emoji ?? '🍽️'
}
