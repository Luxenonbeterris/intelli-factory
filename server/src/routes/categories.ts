import { Router } from 'express'
import prisma from '../prisma'
import logger from '../utils/logger'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.positionCategory.findMany()
    logger.info(`Fetched ${categories.length} categories`)
    res.json(categories)
  } catch (err) {
    logger.error(`Failed to fetch categories: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
