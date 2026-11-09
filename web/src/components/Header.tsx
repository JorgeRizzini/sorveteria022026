import type { MouseEvent } from 'react'
import { Brand } from './Brand'
import type { AuthUser } from '../lib/apiClient'

export type Page = 'home' | 'menu' | 'cart'
type HeaderProps = { page: Page; cartItems: number; user: AuthUser | null; onNavigate: (page: Page) => void; onLogin: () => void; onLogout: () => void }

export function Header({ page, cartItems, user, onNavigate, onLogin, onLogout }: HeaderProps) {
  const link = (event: MouseEvent, destination: Page) => { event.preventDefault(); onNavigate(destination) }
  const name = user?.email?.split('@')[0] ?? 'Minha conta'
  return <header className="header"><nav className="nav container" aria-label="Navegação principal"><span onClick={() => onNavigate('home')}><Brand /></span><div className="nav-links"><a className={page === 'home' ? 'active' : ''} href="/" onClick={(event) => link(event, 'home')}>Início</a><a className={page === 'menu' ? 'active' : ''} href="/cardapio" onClick={(event) => link(event, 'menu')}>Cardápio</a></div><div className="nav-actions"><button className={`cart-button ${page === 'cart' ? 'cart-active' : ''}`} onClick={() => onNavigate('cart')}>▣ <span>Carrinho</span>{cartItems > 0 && <b>{cartItems}</b>}</button>{user ? <><span className="account-greeting" title={user.email}>Olá, {name}</span><button className="logout-button" onClick={onLogout}>Sair</button></> : <button className="dark-button compact" onClick={onLogin}>Entrar</button>}</div></nav></header>
}
