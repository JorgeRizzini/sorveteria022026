export type Category = 'Clássicos' | 'Tropicais' | 'Especiais' | 'Veganos'

export type Flavor = {
  id?: string
  name: string
  subtitle: string
  description: string
  price: number
  emoji: string
  family: 'gold' | 'green' | 'lilac'
  badge: string
  category: Category
  new?: boolean
}
