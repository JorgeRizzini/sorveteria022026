import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Brand } from './components/Brand'
import { LoginModal } from './components/LoginModal'
import { fallbackFlavors } from './data/flavors'
import { api } from './lib/api'
import { clearCart, loadCart, saveCart } from './lib/cartStorage'
import { AccountScreen } from './screens/AccountScreen'
import { CartScreen } from './screens/CartScreen'
import { HomeScreen } from './screens/HomeScreen'
import { MenuScreen } from './screens/MenuScreen'
import { colors } from './theme'
import type { CartItem, Flavor, Screen, User } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [products, setProducts] = useState<Flavor[]>(fallbackFlavors)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartReady, setCartReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    Promise.allSettled([
      api.products().then(setProducts),
      api.currentUser().then(setUser),
      loadCart().then(setCart).finally(() => setCartReady(true)),
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => { if (cartReady) void saveCart(cart) }, [cart, cartReady])

  const navigate = (destination: Screen) => setScreen(destination)
  const add = (flavor: Flavor, quantity: number) => setCart((items) => {
    const existing = items.find((item) => (item.id ?? item.name) === (flavor.id ?? flavor.name))
    if (!existing) return [...items, { ...flavor, quantity }]
    return items.map((item) => item === existing ? { ...item, quantity: Math.min(20, item.quantity + quantity) } : item)
  })
  const changeQuantity = (item: CartItem, amount: number) => setCart((items) => items.flatMap((current) => {
    if ((current.id ?? current.name) !== (item.id ?? item.name)) return [current]
    const quantity = current.quantity + amount
    return quantity > 0 ? [{ ...current, quantity }] : []
  }))
  const checkout = async () => {
    if (!user) { setLoginVisible(true); throw new Error('Entre ou crie uma conta para finalizar.') }
    if (cart.some((item) => !item.id)) throw new Error('Conecte-se à API para confirmar produtos e preços.')
    const quantities = new Map<string, number>()
    cart.forEach((item) => quantities.set(item.id!, (quantities.get(item.id!) ?? 0) + item.quantity))
    const { orderId } = await api.createOrder([...quantities].map(([productId, quantity]) => ({ productId, quantity })))
    setCart([]); await clearCart()
    return orderId
  }
  const logout = async () => { await api.logout(); setUser(null); setScreen('home') }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><View style={styles.header}><Brand /><Pressable onPress={() => user ? navigate('account') : setLoginVisible(true)} style={styles.login}><Text style={styles.loginText}>{user ? 'Minha conta' : 'Entrar'}</Text></Pressable></View><View style={styles.main}>{loading ? <ActivityIndicator color={colors.black} size="large" style={styles.loader} /> : screen === 'home' ? <HomeScreen onAdd={add} onMenu={() => navigate('menu')} products={products} /> : screen === 'menu' ? <MenuScreen onAdd={add} products={products} /> : screen === 'cart' ? <CartScreen cart={cart} onCheckout={checkout} onMenu={() => navigate('menu')} onClear={() => setCart([])} onChangeQuantity={changeQuantity} /> : <AccountScreen onLogin={() => setLoginVisible(true)} onLogout={logout} user={user} />}</View>{Boolean(cart.length) && screen !== 'cart' ? <Pressable accessibilityRole="button" onPress={() => navigate('cart')} style={styles.cartPeek}><View><Text style={styles.cartPeekLabel}>{itemCount} {itemCount === 1 ? 'item no carrinho' : 'itens no carrinho'}</Text><Text style={styles.cartPeekText}>Ver meu pedido</Text></View><Text style={styles.cartPeekTotal}>R${total}</Text></Pressable> : null}<View style={styles.tabs}><Tab active={screen === 'home'} icon="⌂" label="Início" onPress={() => navigate('home')} /><Tab active={screen === 'menu'} icon="🍨" label="Cardápio" onPress={() => navigate('menu')} /><Tab active={screen === 'cart'} badge={itemCount} icon="▣" label="Carrinho" onPress={() => navigate('cart')} /><Tab active={screen === 'account'} icon="●" label="Conta" onPress={() => navigate('account')} /></View><LoginModal onAuthenticated={setUser} onClose={() => setLoginVisible(false)} visible={loginVisible} /></SafeAreaView>
}

function Tab({ active, badge, icon, label, onPress }: { active: boolean; badge?: number; icon: string; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={styles.tab}><View><Text style={[styles.tabIcon, active && styles.tabActive]}>{icon}</Text>{Boolean(badge) && <Text style={styles.badge}>{badge}</Text>}</View><Text style={[styles.tabLabel, active && styles.tabActive]}>{label}</Text></Pressable>
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.white, flex: 1 }, header: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', height: 64, justifyContent: 'space-between', paddingHorizontal: 18 }, login: { backgroundColor: colors.black, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 10 }, loginText: { color: colors.white, fontSize: 12, fontWeight: '900' }, main: { flex: 1 }, loader: { flex: 1 }, cartPeek: { alignItems: 'center', backgroundColor: colors.black, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 14, marginTop: 10, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 13 }, cartPeekLabel: { color: '#d5d2cb', fontSize: 11, fontWeight: '700' }, cartPeekText: { color: colors.white, fontSize: 15, fontWeight: '900', marginTop: 2 }, cartPeekTotal: { color: colors.yellow, fontFamily: 'serif', fontSize: 21, fontWeight: '900' }, tabs: { backgroundColor: colors.white, borderTopColor: colors.line, borderTopWidth: 1, flexDirection: 'row', minHeight: 68, paddingBottom: 5 }, tab: { alignItems: 'center', flex: 1, justifyContent: 'center' }, tabIcon: { color: colors.muted, fontSize: 21, textAlign: 'center' }, tabLabel: { color: colors.muted, fontSize: 10, fontWeight: '800', marginTop: 3 }, tabActive: { color: colors.black }, badge: { backgroundColor: colors.yellow, borderRadius: 10, color: colors.black, fontSize: 9, fontWeight: '900', minWidth: 18, overflow: 'hidden', paddingHorizontal: 4, paddingVertical: 2, position: 'absolute', right: -12, textAlign: 'center', top: -5 },
})
