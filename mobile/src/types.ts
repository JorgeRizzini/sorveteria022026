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

export type Screen = 'home' | 'menu' | 'cart'
