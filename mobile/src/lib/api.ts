import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'
import type { Category, Family, Flavor } from '../types'

const apiUrl = String(Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3001').replace(/\/$/, '')
const tokenKey = 'arcadecream_access_token'

async function request<T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (authenticated) {
    const token = await SecureStore.getItemAsync(tokenKey)
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  const response = await fetch(`${apiUrl}${path}`, { ...init, headers })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? 'Não foi possível concluir a operação.')
  return body as T
}

type ApiProduct = {
  id: string; name: string; subtitle: string; description: string; price_cents: number
  emoji: string; family: Family; badge: string; category: Category; is_new: boolean
}

export const api = {
  async products(): Promise<Flavor[]> {
    const { products } = await request<{ products: ApiProduct[] }>('/products')
    return products.map((product) => ({
      id: product.id, name: product.name, subtitle: product.subtitle,
      description: product.description, price: product.price_cents / 100,
      emoji: product.emoji, family: product.family, badge: product.badge,
      category: product.category, new: product.is_new,
    }))
  },
  async login(email: string, password: string) {
    const result = await request<{ session: { access_token: string } }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    })
    await SecureStore.setItemAsync(tokenKey, result.session.access_token)
  },
}
