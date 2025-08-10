// server/src/controllers/customerRequest.controller.ts
import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import prisma from '../prisma'
import { CreateRequestSchema } from '../schemas/customerRequest.schema'

export async function createCustomerRequest(req: Request, res: Response): Promise<void> {
  const parse = CreateRequestSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({
      error: 'Invalid input',
      details: parse.error.format(),
    })
    return
  }

  const { itemName, unit, quantity, categoryId, description, location } = parse.data

  try {
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

    res.status(201).json({
      message: 'Request created',
      requestId: newRequest.id,
    })
  } catch (err) {
    console.error('[createCustomerRequest]', err)
    res.status(500).json({ error: 'Failed to create request' })
  }
}

export async function getRequestsForFactory(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id

    const factory = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        categoryLinks: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!factory) {
      res.status(404).json({ error: 'Factory not found' })
      return
    }

    const categoryIds = factory.categoryLinks.map((link) => link.category.id)

    const requests = await prisma.customerRequest.findMany({
      where: {
        categoryId: { in: categoryIds },
      },
      select: {
        id: true,
        itemName: true,
        unit: true,
        quantity: true,
        description: true,
      },
    })

    res.json({ requests })
  } catch (err) {
    console.error('[getRequestsForFactory]', err)
    res.status(500).json({ error: 'Failed to fetch requests' })
  }
}

export async function getRequestsForLogist(req: Request, res: Response): Promise<void> {
  try {
    const requests = await prisma.customerRequest.findMany({
      select: {
        id: true,
        location: true,
      },
    })

    res.json({ requests })
  } catch (err) {
    console.error('[getRequestsForLogist]', err)
    res.status(500).json({ error: 'Failed to fetch requests' })
  }
}

export async function getRequestsForManager(req: Request, res: Response): Promise<void> {
  try {
    const { from, status, categoryId, search, limit = '50', offset = '0' } = req.query

    const filters: Prisma.CustomerRequestWhereInput = {}

    if (from && typeof from === 'string') {
      filters.createdAt = { gte: new Date(from) }
    } else {
      filters.createdAt = { gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    }

    if (status && typeof status === 'string') {
      filters.status = status.toUpperCase()
    }

    if (categoryId && !isNaN(Number(categoryId))) {
      filters.categoryId = Number(categoryId)
    }

    if (search && typeof search === 'string') {
      filters.itemName = { contains: search, mode: 'insensitive' }
    }

    const take = Number(limit) || 50
    const skip = Number(offset) || 0

    const [requests, total] = await Promise.all([
      prisma.customerRequest.findMany({
        where: filters,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, email: true, name: true } },
          category: true,
        },
      }),
      prisma.customerRequest.count({ where: filters }),
    ])

    res.json({
      requests,
      pagination: {
        total,
        limit: take,
        offset: skip,
        hasMore: skip + take < total,
      },
    })
  } catch (err) {
    console.error('[getRequestsForManager]', err)
    res.status(500).json({ error: 'Failed to fetch requests' })
  }
}

export async function getRequestsForCustomer(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id

    const limit = Number(req.query.limit) || 50
    const offset = Number(req.query.offset) || 0

    const [requests, total] = await Promise.all([
      prisma.customerRequest.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: 'desc' },
        include: { category: true },
        take: limit,
        skip: offset,
      }),
      prisma.customerRequest.count({
        where: { customerId: userId },
      }),
    ])

    res.json({
      requests,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (err) {
    console.error('[getRequestsForCustomer]', err)
    res.status(500).json({ error: 'Failed to fetch your requests' })
  }
}
