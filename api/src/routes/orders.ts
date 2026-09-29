import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '../lib/supabase.js'
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js'

export const ordersRouter = Router()
ordersRouter.use(requireAuth)

ordersRouter.post('/', async (req, res) => {
  const input = z.object({ items: z.array(z.object({ productId: z.uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(30) }).parse(req.body)
  const { user } = req as AuthenticatedRequest
  const { data, error } = await supabaseAdmin.rpc('create_order_for_user', { p_user_id: user.id, p_items: input.items.map((item) => ({ product_id: item.productId, quantity: item.quantity })) })
  if (error) { res.status(400).json({ error: error.message }); return }
  res.status(201).json({ orderId: data })
})

ordersRouter.get('/', async (req, res) => {
  const { user } = req as AuthenticatedRequest
  const { data, error } = await supabaseAdmin.from('orders').select('id, status, total_cents, created_at, order_items(id, product_name, unit_price_cents, quantity)').eq('user_id', user.id).order('created_at', { ascending: false })
  if (error) { res.status(500).json({ error: 'Não foi possível carregar os pedidos.' }); return }
  res.json({ orders: data })
})
