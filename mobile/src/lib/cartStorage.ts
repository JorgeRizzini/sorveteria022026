import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Flavor } from '../types'

const key = 'arcadecream_cart'

export async function loadCart(): Promise<Flavor[]> {
  try { const value = await AsyncStorage.getItem(key); return value ? JSON.parse(value) as Flavor[] : [] }
  catch { return [] }
}

export async function saveCart(cart: Flavor[]) {
  await AsyncStorage.setItem(key, JSON.stringify(cart))
}

export async function clearCart() {
  await AsyncStorage.removeItem(key)
}
