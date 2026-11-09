const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const accessTokenKey = 'arcadecream_access_token'
const refreshTokenKey = 'arcadecream_refresh_token'

type ApiRequestOptions = RequestInit & { authenticated?: boolean }
export type AuthUser = { id: string; email?: string }
type Session = { access_token: string; refresh_token: string }

class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function saveSession(session: Session) {
  sessionStorage.setItem(accessTokenKey, session.access_token)
  sessionStorage.setItem(refreshTokenKey, session.refresh_token)
}

function clearSession() {
  sessionStorage.removeItem(accessTokenKey)
  sessionStorage.removeItem(refreshTokenKey)
}

async function refreshSession() {
  const refreshToken = sessionStorage.getItem(refreshTokenKey)
  if (!refreshToken) return false
  const response = await fetch(`${apiUrl}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }),
  })
  if (!response.ok) { clearSession(); return false }
  const result = await response.json() as { session?: Session }
  if (!result.session) return false
  saveSession(result.session)
  return true
}

async function request<T>(path: string, options: ApiRequestOptions = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (options.authenticated) {
    const token = sessionStorage.getItem(accessTokenKey)
    if (!token) throw new ApiError('Entre para continuar.', 401)
    headers.set('Authorization', `Bearer ${token}`)
  }
  const response = await fetch(`${apiUrl}${path}`, { ...options, headers })
  if (response.status === 401 && options.authenticated && retry && await refreshSession()) return request<T>(path, options, false)
  const body = await response.json()
  if (!response.ok) throw new ApiError(body.error ?? 'Não foi possível concluir a operação.', response.status)
  return body as T
}

export type ApiProduct = { id: string; slug: string; name: string; subtitle: string; description: string; price_cents: number; emoji: string; family: 'gold' | 'green' | 'lilac'; badge: string; category: 'Clássicos' | 'Tropicais' | 'Especiais' | 'Veganos'; is_new: boolean }

export const api = {
  products: () => request<{ products: ApiProduct[] }>('/products'),
  async login(email: string, password: string) {
    const result = await request<{ user: AuthUser; session: Session }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    saveSession(result.session)
    return result.user
  },
  async currentUser(): Promise<AuthUser | null> {
    if (!sessionStorage.getItem(accessTokenKey)) return null
    try { return (await request<{ user: AuthUser }>('/me', { authenticated: true })).user }
    catch (error) { if (error instanceof ApiError && error.status === 401) return null; throw error }
  },
  logout() { clearSession() },
}
