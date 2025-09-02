// server/src/middlewares/requestId.ts
// middleware/requestId.ts
import { randomUUID } from 'crypto'
import { NextFunction, Request, Response } from 'express'

export function requestId(req: Request, _res: Response, next: NextFunction) {
  req.id = (req.headers['x-request-id'] as string) || randomUUID()
  next()
}
