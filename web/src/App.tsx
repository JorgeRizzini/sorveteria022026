import { useEffect, useState } from 'react'
import './App.css'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header, type Page } from './components/Header'
import { LoginModal } from './components/LoginModal'
import { fallbackFlavors } from './data/flavors'
import { api, type AuthUser } from './lib/apiClient'
import { CartPage } from './pages/CartPage'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import type { CartItem, Flavor } from './types/flavor'

function pageFromPath(): Page { if (window.location.pathname.includes('carrinho')) return 'cart'; if (window.location.pathname.includes('cardapio')) return 'menu'; return 'home' }
function sameProduct(first: Flavor, second: Flavor) { return first.id ? first.id === second.id : first.name === second.name }

function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [catalog, setCatalog] = useState<Flavor[]>(fallbackFlavors)
  const [loginOpen, setLoginOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [page, setPage] = useState<Page>(pageFromPath)

  useEffect(() => { const onPopState = () => setPage(pageFromPath()); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState) }, [])
  useEffect(() => { api.currentUser().then(setUser).catch(() => setUser(null)) }, [])
  useEffect(() => { api.products().then(({ products }) => setCatalog(products.map((product) => ({ id: product.id, name: product.name, subtitle: product.subtitle, description: product.description, price: product.price_cents / 100, emoji: product.emoji, family: product.family, badge: product.badge, category: product.category, new: product.is_new })))).catch((error) => console.warn('API indisponível; usando catálogo local.', error)) }, [])

  const navigate = (destination: Page) => { const path = destination === 'menu' ? '/cardapio' : destination === 'cart' ? '/carrinho' : '/'; window.history.pushState({}, '', path); setPage(destination); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const addToCart = (flavor: Flavor, quantity: number) => { setCart((items) => { const index = items.findIndex((item) => sameProduct(item, flavor)); if (index === -1) return [...items, { ...flavor, quantity }]; return items.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.min(20, item.quantity + quantity) } : item) }); setDrawerOpen(true) }
  const changeQuantity = (target: CartItem, amount: number) => setCart((items) => items.flatMap((item) => { if (!sameProduct(item, target)) return [item]; const quantity = item.quantity + amount; return quantity > 0 ? [{ ...item, quantity: Math.min(20, quantity) }] : [] }))
  const clearCart = () => setCart([])
  const logout = () => { api.logout(); setUser(null) }
  const cartItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const checkout = () => navigate('cart')

  return <div className={`site-shell ${drawerOpen ? 'drawer-layout' : ''}`}><div className="site-content"><Header page={page} cartItems={cartItems} user={user} onNavigate={navigate} onLogin={() => setLoginOpen(true)} onLogout={logout} />{page === 'home' && <HomePage products={catalog} onAdd={addToCart} onMenu={() => navigate('menu')} />}{page === 'menu' && <MenuPage products={catalog} onAdd={addToCart} />}{page === 'cart' && <CartPage cart={cart} onMenu={() => navigate('menu')} onClear={clearCart} onChangeQuantity={changeQuantity} />}<Footer /></div>{drawerOpen && <CartDrawer cart={cart} onClose={() => setDrawerOpen(false)} onClear={clearCart} onChangeQuantity={changeQuantity} onCheckout={checkout} />}{loginOpen && <LoginModal onAuthenticated={setUser} onClose={() => setLoginOpen(false)} />}</div>
}

export default App
