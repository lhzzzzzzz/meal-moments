import { z } from 'zod'

export const updateShareSettingsSchema = z.object({
  isEnabled: z.boolean(),
})

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, '展示名不能为空').max(50, '最多 50 字'),
  shareTitle: z.string().max(100, '最多 100 字').optional(),
  shareDescription: z.string().max(300, '最多 300 字').optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
