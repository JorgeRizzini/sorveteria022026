import { Router } from 'express'
import { z } from 'zod'
import { createPublicAuthClient } from '../lib/supabase.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
  const input = z.object({ email: z.email(), password: z.string().min(10).max(72), fullName: z.string().trim().min(2).max(120) }).parse(req.body)
  const { data, error } = await createPublicAuthClient().auth.signUp({ email: input.email, password: input.password, options: { data: { full_name: input.fullName } } })
  if (error) { res.status(400).json({ error: error.message }); return }
  res.status(201).json({ user: data.user && { id: data.user.id, email: data.user.email }, session: data.session, emailConfirmationRequired: !data.session })
})
authRouter.post('/login', async (req, res) => {
  const input = z.object({ email: z.email(), password: z.string().min(1).max(72) }).parse(req.body)
  const { data, error } = await createPublicAuthClient().auth.signInWithPassword(input)
  if (error) { res.status(401).json({ error: 'E-mail ou senha inválidos.' }); return }
  res.json({ user: { id: data.user.id, email: data.user.email }, session: data.session })
})
