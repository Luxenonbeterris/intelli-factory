// server/src/routes/profile.routes.ts
import { Router } from 'express'
import { getMe, updateMe } from '../controllers/profile.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const r = Router()

r.get('/me', authMiddleware, getMe)
r.patch('/me', authMiddleware, updateMe)

export default r
