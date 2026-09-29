const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

type ApiRequestOptions = RequestInit & { authenticated?: boolean }

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (options.authenticated) {
    const token = sessionStorage.getItem('arcadecream_access_token')
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${apiUrl}${path}`, { ...options, headers })
  const body = await response.json()

  if (!response.ok) {
    throw new Error(body.error ?? 'Não foi possível concluir a operação.')
  }

  return body as T
}

export type ApiProduct = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  price_cents: number
  emoji: string
  family: 'gold' | 'green' | 'lilac'
  badge: string
  category: 'Clássicos' | 'Tropicais' | 'Especiais' | 'Veganos'
  is_new: boolean
}

export const api = {
  products: () => request<{ products: ApiProduct[] }>('/products'),
  async login(email: string, password: string) {
    const result = await request<{
      user: { id: string; email?: string }
      session: { access_token: string }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    sessionStorage.setItem('arcadecream_access_token', result.session.access_token)
    return result.user
  },
  logout() {
    sessionStorage.removeItem('arcadecream_access_token')
  },
}
