import { Router } from 'express'
import {
  createCustomerRequest,
  getRequestsForFactory,
  getRequestsForLogist,
  getRequestsForManager,
} from '../controllers/customerRequest.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'

const router = Router()
router.use(authMiddleware)

router.post('/', requireRole('CUSTOMER'), createCustomerRequest)

router.get('/manager', requireRole('MANAGER'), getRequestsForManager)

router.get('/factory', requireRole('FACTORY'), getRequestsForFactory)

router.get('/logist', requireRole('LOGISTIC'), getRequestsForLogist)

export default router
