export type Category = 'Clássicos' | 'Tropicais' | 'Especiais' | 'Veganos'
export type Family = 'gold' | 'green' | 'lilac'

export type Flavor = {
  id?: string
  name: string
  subtitle: string
  description: string
  price: number
  emoji: string
  family: Family
  badge: string
  category: Category
  new?: boolean
}

export type CartItem = Flavor & { quantity: number }

export type Screen = 'home' | 'menu' | 'cart' | 'account'

export type User = { id: string; email?: string }
export type Profile = { id: string; full_name: string | null; phone: string | null; created_at: string }
export type OrderItem = { id: string; product_name: string; unit_price_cents: number; quantity: number }
export type Order = { id: string; status: string; total_cents: number; created_at: string; order_items: OrderItem[] }
