import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js'

export const profileRouter = Router()

profileRouter.get('/', requireAuth, async (req, res) => {
  const { user } = req as AuthenticatedRequest
  const { data: profile, error } = await supabaseAdmin.from('profiles').select('id, full_name, phone, created_at').eq('id', user.id).single()
  if (error) { res.status(404).json({ error: 'Perfil não encontrado.' }); return }
  res.json({ user, profile })
})
