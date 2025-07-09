import { Router } from 'express'
import prisma from '../prisma'
import logger from '../utils/logger'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const requests = await prisma.customerRequest.findMany({
      include: {
        category: true,
        customer: true,
      },
    })
    logger.info(`Fetched ${requests.length} customer requests`)
    res.json(requests)
  } catch (err) {
    logger.error(`Failed to fetch requests: ${err}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
