// server/src/routes/email.routes.ts
import { Router } from 'express'
import { postResendVerify, postVerifyEmail } from '../controllers/email.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.post('/verify', postVerifyEmail)
router.post('/verify/resend', authMiddleware, postResendVerify)

export default router
