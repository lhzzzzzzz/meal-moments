import { z } from 'zod'
import { isFutureDatetimeLocal } from '@/lib/shared/formatters/format-datetime-local'

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

export const recordFormSchema = z.object({
  title: z
    .string()
    .max(40, '标题最多 40 字')
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
      '请输入有效金额'
    ),
  currency: z.enum(CURRENCY_VALUES),
  occurredAt: z.string().min(1, '请选择日期时间'),
  location: z.string().max(40, '地点最多 40 字').optional(),
  note: z.string().max(300, '备注最多 300 字').optional(),
  mood: z.enum(MOOD_VALUES).nullish().transform((v) => v ?? undefined),
  tagIds: z.array(z.string()).optional(),
  isShared: z.boolean(),
})

export type RecordFormInput = z.input<typeof recordFormSchema>
export type RecordFormValues = z.output<typeof recordFormSchema>

/** 表单校验（datetime-local 格式，需传入用户时区） */
export function createRecordFormSchema(timeZone: string) {
  return recordFormSchema.extend({
    occurredAt: z
      .string()
      .min(1, '请选择日期时间')
      .refine(
        (val) => !isFutureDatetimeLocal(val, timeZone),
        '不能选择未来的时间'
      ),
  })
}

export const imageUploadSchema = z.object({
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
    .min(1, '至少上传一张图片')
    .max(6, '最多上传 6 张图片'),
})

export const createRecordSchema = recordFormSchema
  .extend({
    occurredAt: z
      .string()
      .min(1, '请选择日期时间')
      .refine(
        (val) => new Date(val).getTime() <= Date.now(),
        '不能选择未来的时间'
      ),
  })
  .merge(imageUploadSchema)
export type CreateRecordInput = z.infer<typeof createRecordSchema>
