// server/src/schemas/profile.schema.ts
import { z } from 'zod'

export const UpdateMeSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  countryId: z.number().int().positive().nullable().optional(),
  regionId: z.number().int().positive().nullable().optional(),
  street: z.string().trim().max(120).nullable().optional(),
  postalCode: z.string().trim().max(20).nullable().optional(),
})
export type UpdateMeInput = z.infer<typeof UpdateMeSchema>
