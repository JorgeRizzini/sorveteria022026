import { supabaseAdmin } from '../lib/supabase.js'

const tables = ['products', 'profiles', 'orders', 'order_items'] as const

for (const table of tables) {
  const { count, error } = await supabaseAdmin
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error(`Falha ao consultar ${table}:`, error.message)
    process.exit(1)
  }

  console.log(`${table}: disponível (${count ?? 0} registros)`)
}

console.log('Conexão e schema do Supabase confirmados.')
