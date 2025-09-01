// server/src/schemas/registerSchema.ts
import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().trim().min(1),
  role: z.enum(['CUSTOMER', 'FACTORY', 'LOGISTIC']),
  countryId: z.coerce.number().int().positive(),
  regionId: z.coerce.number().int().positive().optional().nullable(),
  street: z.string().trim().optional().nullable(),
  postalCode: z.string().trim().optional().nullable(),
})
