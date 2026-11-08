import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'
import type { Category, Family, Flavor, Order, Profile, User } from '../types'

const apiUrl = String(Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3001').replace(/\/$/, '')
const accessTokenKey = 'arcadecream_access_token'
const refreshTokenKey = 'arcadecream_refresh_token'

type Session = { access_token: string; refresh_token: string }
type AuthResult = { user: User; session: Session | null; emailConfirmationRequired?: boolean }

class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message) }
}

async function saveSession(session: Session) {
  await Promise.all([
    SecureStore.setItemAsync(accessTokenKey, session.access_token),
    SecureStore.setItemAsync(refreshTokenKey, session.refresh_token),
  ])
}

async function clearSession() {
  await Promise.all([SecureStore.deleteItemAsync(accessTokenKey), SecureStore.deleteItemAsync(refreshTokenKey)])
}

async function refreshSession() {
  const refreshToken = await SecureStore.getItemAsync(refreshTokenKey)
  if (!refreshToken) return false
  const response = await fetch(`${apiUrl}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!response.ok) { await clearSession(); return false }
  const result = await response.json() as AuthResult
  if (!result.session) return false
  await saveSession(result.session)
  return true
}

async function request<T>(path: string, init: RequestInit = {}, authenticated = false, retry = true): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (authenticated) {
    const token = await SecureStore.getItemAsync(accessTokenKey)
    if (!token) throw new ApiError('Entre para continuar.', 401)
    headers.set('Authorization', `Bearer ${token}`)
  }
  const response = await fetch(`${apiUrl}${path}`, { ...init, headers })
  if (response.status === 401 && authenticated && retry && await refreshSession()) return request<T>(path, init, true, false)
  const body = await response.json()
  if (!response.ok) throw new ApiError(body.error ?? 'Não foi possível concluir a operação.', response.status)
  return body as T
}

type ApiProduct = { id: string; name: string; subtitle: string; description: string; price_cents: number; emoji: string; family: Family; badge: string; category: Category; is_new: boolean }

export const api = {
  async products(): Promise<Flavor[]> {
    const { products } = await request<{ products: ApiProduct[] }>('/products')
    return products.map((product) => ({ id: product.id, name: product.name, subtitle: product.subtitle, description: product.description, price: product.price_cents / 100, emoji: product.emoji, family: product.family, badge: product.badge, category: product.category, new: product.is_new }))
  },
  async login(email: string, password: string) {
    const result = await request<AuthResult>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    if (!result.session) throw new Error('Não foi possível criar a sessão.')
    await saveSession(result.session)
    return result.user
  },
  async register(fullName: string, email: string, password: string) {
    const result = await request<AuthResult>('/auth/register', { method: 'POST', body: JSON.stringify({ fullName, email, password }) })
    if (result.session) await saveSession(result.session)
    return result
  },
  async currentUser(): Promise<User | null> {
    if (!await SecureStore.getItemAsync(accessTokenKey)) return null
    try { return (await request<{ user: User }>('/me', {}, true)).user }
    catch (error) { if (error instanceof ApiError && error.status === 401) return null; throw error }
  },
  profile: () => request<{ user: User; profile: Profile }>('/me', {}, true),
  orders: () => request<{ orders: Order[] }>('/orders', {}, true),
  createOrder(items: Array<{ productId: string; quantity: number }>) {
    return request<{ orderId: string }>('/orders', { method: 'POST', body: JSON.stringify({ items }) }, true)
  },
  logout: clearSession,
}
