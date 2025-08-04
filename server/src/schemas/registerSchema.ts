import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['CUSTOMER', 'FACTORY', 'LOGISTIC']),
  location: z.string().min(1),
  countryId: z.number().int(),
  regionId: z.number().int(),
})
