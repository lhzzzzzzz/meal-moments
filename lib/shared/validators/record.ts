import { z } from 'zod'

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

export const recordFormSchema = z.object({
  title: z
    .string()
    .min(1, '标题不能为空')
    .max(40, '标题最多 40 字'),
  mealType: z.enum(MEAL_TYPE_VALUES, { error: '请选择餐别' }),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
      '请输入有效金额'
    ),
  occurredAt: z.string().min(1, '请选择日期时间'),
  location: z.string().max(40, '地点最多 40 字').optional(),
  note: z.string().max(300, '备注最多 300 字').optional(),
  mood: z.enum(MOOD_VALUES).nullish().transform((v) => v ?? undefined),
  tagIds: z.array(z.string()).optional(),
  isShared: z.boolean(),
})

export type RecordFormInput = z.input<typeof recordFormSchema>
export type RecordFormValues = z.output<typeof recordFormSchema>

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

export const createRecordSchema = recordFormSchema.merge(imageUploadSchema)
export type CreateRecordInput = z.infer<typeof createRecordSchema>
