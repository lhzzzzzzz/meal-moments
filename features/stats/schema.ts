import { z } from 'zod'

export const statsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  preset: z.enum(['week', 'month', '3months']).optional(),
})

export type StatsQuery = z.infer<typeof statsQuerySchema>
