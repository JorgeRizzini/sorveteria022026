import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

export const productsRouter = Router()

productsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('products').select('id, slug, name, subtitle, description, price_cents, emoji, family, badge, category, is_new').eq('active', true).order('name')
  if (error) { res.status(500).json({ error: 'Não foi possível carregar os produtos.' }); return }
  res.json({ products: data })
})
