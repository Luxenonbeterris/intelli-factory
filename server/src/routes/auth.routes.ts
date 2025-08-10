// server/src/routes/auth.routes.ts
import { Router } from 'express'
import { login, profile, register, verifyEmail } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify-email', verifyEmail)
router.get('/profile', authMiddleware, profile)

export default router
