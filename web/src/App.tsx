import { useEffect, useState } from 'react'
import './App.css'
import { Footer } from './components/Footer'
import { Header, type Page } from './components/Header'
import { LoginModal } from './components/LoginModal'
import { fallbackFlavors } from './data/flavors'
import { api } from './lib/apiClient'
import { CartPage } from './pages/CartPage'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import type { Flavor } from './types/flavor'

function pageFromPath(): Page {
  if (window.location.pathname.includes('carrinho')) return 'cart'
  if (window.location.pathname.includes('cardapio')) return 'menu'
  return 'home'
}

function App() {
  const [cart, setCart] = useState<Flavor[]>([])
  const [catalog, setCatalog] = useState<Flavor[]>(fallbackFlavors)
  const [loginOpen, setLoginOpen] = useState(false)
  const [page, setPage] = useState<Page>(pageFromPath)

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    api.products().then(({ products }) => setCatalog(products.map((product) => ({
      id: product.id, name: product.name, subtitle: product.subtitle,
      description: product.description, price: product.price_cents / 100,
      emoji: product.emoji, family: product.family, badge: product.badge,
      category: product.category, new: product.is_new,
    })))).catch((error) => console.warn('API indisponível; usando catálogo local.', error))
  }, [])

  const navigate = (destination: Page) => {
    const path = destination === 'menu' ? '/cardapio' : destination === 'cart' ? '/carrinho' : '/'
    window.history.pushState({}, '', path)
    setPage(destination)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addToCart = (flavor: Flavor) => setCart((items) => [...items, flavor])

  return <div className="site-shell">
    <Header page={page} cartItems={cart.length} onNavigate={navigate} onLogin={() => setLoginOpen(true)} />
    {page === 'home' && <HomePage products={catalog} onAdd={addToCart} onMenu={() => navigate('menu')} />}
    {page === 'menu' && <MenuPage products={catalog} onAdd={addToCart} />}
    {page === 'cart' && <CartPage cart={cart} onMenu={() => navigate('menu')} onRemove={(index) => setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))} />}
    <Footer />
    {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
  </div>
}

export default App
