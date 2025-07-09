import { Router } from 'express'
import prisma from '../prisma'
import logger from '../utils/logger'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const offers = await prisma.factoryOffer.findMany({
      include: {
        factory: true,
        request: true,
      },
    })
    logger.info(`Fetched ${offers.length} offers`)
    res.json(offers)
  } catch (err) {
    logger.error(`Failed to fetch offers: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
