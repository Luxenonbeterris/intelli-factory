import { z } from 'zod'

export const CreateRequestSchema = z.object({
  itemName: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number().positive(),
  categoryId: z.number(),
  description: z.string().optional(),
  location: z.string().optional(),
})
