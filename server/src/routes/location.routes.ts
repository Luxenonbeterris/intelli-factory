// server/src/routes/location.routes.ts
import { Router } from 'express'
import { getCountries, getRegions } from '../controllers/location.controller'

const router = Router()

router.get('/countries', getCountries)
router.get('/regions', getRegions)

export default router
