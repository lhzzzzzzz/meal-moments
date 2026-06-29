import type { Mood } from '@/types/record'

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'normal', label: '平常', emoji: '😐' },
  { value: 'tired', label: '疲惫', emoji: '😴' },
  { value: 'satisfied', label: '满足', emoji: '😌' },
  { value: 'homesick', label: '想家', emoji: '🏠' },
  { value: 'busy', label: '忙碌', emoji: '⚡' },
  { value: 'other', label: '其他', emoji: '💭' },
]

export const MOOD_MAP: Record<Mood, { label: string; emoji: string }> =
  Object.fromEntries(
    MOODS.map(({ value, label, emoji }) => [value, { label, emoji }])
  ) as Record<Mood, { label: string; emoji: string }>

export function getMoodLabel(value: string): string {
  return MOOD_MAP[value as Mood]?.label ?? value
}

export function getMoodEmoji(value: string): string {
  return MOOD_MAP[value as Mood]?.emoji ?? '💭'
}
