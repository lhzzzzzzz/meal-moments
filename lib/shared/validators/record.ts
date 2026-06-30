import { z } from 'zod'
import { isFutureDatetimeLocal } from '@/lib/shared/formatters/format-datetime-local'
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

export const MOOD_VALUES = [
  'happy',
  'normal',
  'tired',
  'satisfied',
  'homesick',
  'busy',
  'other',
] as const

export const CURRENCY_VALUES = ['AUD', 'CNY'] as const

export function createRecordFormSchema(timeZone: string, t: Translator) {
  return z.object({
    title: z
      .string()
      .max(40, t('validation.titleMax'))
      .optional()
      .transform((v) => v?.trim() ?? ''),
    mealType: z
      .enum(MEAL_TYPE_VALUES)
      .optional()
      .transform((v) => v ?? ''),
    amount: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
        t('validation.invalidAmount')
      ),
    currency: z.enum(CURRENCY_VALUES),
    occurredAt: z
      .string()
      .min(1, t('validation.selectDatetime'))
      .refine(
        (val) => !isFutureDatetimeLocal(val, timeZone),
        t('validation.futureDatetime')
      ),
    location: z.string().max(40, t('validation.locationMax')).optional(),
    note: z.string().max(300, t('validation.noteMax')).optional(),
    mood: z.enum(MOOD_VALUES).nullish().transform((v) => v ?? undefined),
    tagIds: z.array(z.string()).optional(),
    isShared: z.boolean(),
  })
}

export type RecordFormInput = z.input<ReturnType<typeof createRecordFormSchema>>
export type RecordFormValues = z.output<ReturnType<typeof createRecordFormSchema>>

export function createImageUploadSchema(t: Translator) {
  return z.object({
    images: z
      .array(
        z.object({
          storagePath: z.string(),
          publicUrl: z.string(),
          width: z.number().optional(),
          height: z.number().optional(),
          sizeBytes: z.number().optional(),
        })
      )
      .min(1, t('validation.minOneImage'))
      .max(6, t('validation.maxSixImages')),
  })
}

export function createRecordSchema(timeZone: string, t: Translator) {
  return createRecordFormSchema(timeZone, t).merge(createImageUploadSchema(t))
}

export type CreateRecordInput = z.infer<ReturnType<typeof createRecordSchema>>
