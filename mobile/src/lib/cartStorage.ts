import AsyncStorage from '@react-native-async-storage/async-storage'
import type { CartItem, Flavor } from '../types'

const key = 'arcadecream_cart'

export async function loadCart(): Promise<CartItem[]> {
  try {
    const value = await AsyncStorage.getItem(key)
    if (!value) return []
    return (JSON.parse(value) as Array<Flavor | CartItem>).map((item) => ({ ...item, quantity: 'quantity' in item ? item.quantity : 1 }))
  }
  catch { return [] }
}

export async function saveCart(cart: CartItem[]) {
  await AsyncStorage.setItem(key, JSON.stringify(cart))
}

export async function clearCart() {
  await AsyncStorage.removeItem(key)
}
