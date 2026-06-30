import { z } from 'zod'
import type { Translator } from '@/lib/i18n/t'

export const updateShareSettingsSchema = z.object({
  isEnabled: z.boolean(),
})

export function createUpdateProfileSchema(t: Translator) {
  return z.object({
    displayName: z
      .string()
      .min(1, t('validation.displayNameRequired'))
      .max(50, t('validation.displayNameMax')),
    shareTitle: z.string().max(100, t('validation.shareTitleMax')).optional(),
    shareDescription: z
      .string()
      .max(300, t('validation.shareDescriptionMax'))
      .optional(),
    timezone: z.string().optional(),
    currency: z.string().optional(),
  })
}

export type UpdateProfileInput = z.infer<ReturnType<typeof createUpdateProfileSchema>>
