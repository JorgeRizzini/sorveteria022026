import type { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

export type AuthenticatedRequest = Request & {
  user: { id: string; email?: string }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null

  if (!token) {
    res.status(401).json({ error: 'Token de acesso ausente.' })
    return
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data.user) {
    res.status(401).json({ error: 'Token de acesso inválido ou expirado.' })
    return
  }

  ;(req as AuthenticatedRequest).user = {
    id: data.user.id,
    email: data.user.email,
  }
  next()
}
