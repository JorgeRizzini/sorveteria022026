import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import helmet from 'helmet'
import { z } from 'zod'
import { env } from './config/env.js'
import { authRouter } from './routes/auth.js'
import { healthRouter } from './routes/health.js'
import { ordersRouter } from './routes/orders.js'
import { profileRouter } from './routes/profile.js'
import { productsRouter } from './routes/products.js'

export const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json({ limit: '32kb' }))
app.use('/health', healthRouter)
app.use('/auth', authRouter)
app.use('/me', profileRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) { res.status(400).json({ error: 'Dados inválidos.', details: error.flatten().fieldErrors }); return }
  console.error(error)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})
