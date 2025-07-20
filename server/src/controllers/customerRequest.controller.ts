import { Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../prisma'

const CreateRequestSchema = z.object({
  itemName: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number().positive(),
  categoryId: z.number(),
  description: z.string().optional(),
  location: z.string().optional(),
})

export async function createCustomerRequest(req: Request, res: Response) {
  const parse = CreateRequestSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid input', details: parse.error.format() })
    return
  }

  const { itemName, unit, quantity, categoryId, description, location } = parse.data

  const newRequest = await prisma.customerRequest.create({
    data: {
      itemName,
      unit,
      quantity,
      categoryId,
      description,
      location,
      customerId: req.user!.id,
    },
  })

  res.json({ message: 'Request created', requestId: newRequest.id })
}

export async function getRequestsForManager(req: Request, res: Response) {
  const requests = await prisma.customerRequest.findMany({
    include: {
      customer: { select: { id: true, email: true, name: true } },
      category: true,
    },
  })

  res.json({ requests })
}

export async function getRequestsForFactory(req: Request, res: Response) {
  const requests = await prisma.customerRequest.findMany({
    select: {
      id: true,
      itemName: true,
      unit: true,
      quantity: true,
      description: true,
    },
  })

  res.json({ requests })
}

export async function getRequestsForLogist(req: Request, res: Response) {
  const requests = await prisma.customerRequest.findMany({
    select: {
      id: true,
      location: true,
    },
  })

  res.json({ requests })
}
