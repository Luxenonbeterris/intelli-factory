import { Role } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== role) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    next()
  }
}
