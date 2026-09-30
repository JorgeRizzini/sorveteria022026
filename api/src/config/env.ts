import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) })

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  SUPABASE_SECRET_KEY: z.string().min(20),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('Variáveis de ambiente inválidas:', result.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = result.data
