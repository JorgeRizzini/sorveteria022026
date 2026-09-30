import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  const { error } = await supabaseAdmin.from('products').select('id').limit(1)
  res.status(error ? 503 : 200).json({
    status: error ? 'degraded' : 'ok',
    database: error ? 'unavailable' : 'connected',
  })
})
