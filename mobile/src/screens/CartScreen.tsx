import { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, familyColors } from '../theme'
import type { CartItem } from '../types'

type Props = {
  cart: CartItem[]
  onMenu: () => void
  onClear: () => void
  onChangeQuantity: (item: CartItem, amount: number) => void
  onCheckout: () => Promise<string>
}

export function CartScreen({ cart, onMenu, onClear, onChangeQuantity, onCheckout }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const checkout = async () => {
    setLoading(true); setError('')
    try { setOrderId(await onCheckout()) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível criar o pedido.') }
    finally { setLoading(false) }
  }

  if (orderId) return <View style={styles.empty}><Text style={styles.emptyEmoji}>✅</Text><Text style={styles.emptyTitle}>Pedido recebido!</Text><Text style={styles.emptyText}>Código {orderId.slice(0, 8).toUpperCase()}</Text><Pressable onPress={onMenu} style={styles.primary}><Text style={styles.primaryText}>Escolher mais sabores</Text></Pressable></View>
  if (!cart.length) return <View style={styles.empty}><Text style={styles.emptyEmoji}>🍦</Text><Text style={styles.emptyTitle}>Carrinho vazio</Text><Text style={styles.emptyText}>Adicione seus sabores favoritos.</Text><Pressable onPress={onMenu} style={styles.primary}><Text style={styles.primaryText}>Ver cardápio</Text></Pressable></View>

  return <FlatList contentContainerStyle={styles.list} data={cart} keyExtractor={(item) => item.id ?? item.name} ListHeaderComponent={<View><Text style={styles.label}>SEU PEDIDO</Text><Text style={styles.title}>Meu carrinho</Text><Text style={styles.count}>{itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}</Text></View>} renderItem={({ item }) => <View style={styles.row}><View style={[styles.art, { backgroundColor: familyColors[item.family] }]}><Text style={styles.emoji}>{item.emoji}</Text></View><View style={styles.details}><Text style={styles.name}>{item.name}</Text><Text style={styles.subtitle}>{item.subtitle}</Text><View style={styles.stepper}><Pressable accessibilityLabel={`Diminuir ${item.name}`} onPress={() => onChangeQuantity(item, -1)} style={styles.stepperButton}><Text style={styles.stepperText}>−</Text></Pressable><Text style={styles.quantity}>{item.quantity}</Text><Pressable accessibilityLabel={`Aumentar ${item.name}`} onPress={() => onChangeQuantity(item, 1)} style={styles.stepperButton}><Text style={styles.stepperText}>+</Text></Pressable></View></View><Text style={styles.itemPrice}>R${item.price * item.quantity}</Text></View>} ListFooterComponent={<View style={styles.summary}><Text style={styles.summaryTitle}>Resumo do pedido</Text><View style={styles.summaryRow}><Text>Subtotal</Text><Text style={styles.bold}>R${total}</Text></View><View style={styles.summaryRow}><Text>Retirada na loja</Text><Text style={styles.bold}>Grátis</Text></View><View style={[styles.summaryRow, styles.total]}><Text style={styles.summaryTitle}>Total</Text><Text style={styles.totalPrice}>R${total}</Text></View>{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable disabled={loading} onPress={checkout} style={styles.checkout}>{loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.checkoutText}>Finalizar pedido</Text>}</Pressable><Pressable onPress={onMenu}><Text style={styles.continue}>Continuar comprando</Text></Pressable><Pressable accessibilityRole="button" onPress={onClear} style={styles.clear}><Text style={styles.clearText}>Limpar carrinho</Text></Pressable></View>} showsVerticalScrollIndicator={false} />
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', backgroundColor: colors.white, flex: 1, justifyContent: 'center', padding: 24 },
  emptyEmoji: { fontSize: 56 }, emptyTitle: { fontFamily: 'serif', fontSize: 28, fontWeight: '900', marginTop: 14 }, emptyText: { color: colors.muted, marginTop: 8 }, primary: { backgroundColor: colors.yellow, borderRadius: 24, marginTop: 20, paddingHorizontal: 24, paddingVertical: 14 }, primaryText: { color: colors.black, fontWeight: '900' },
  list: { backgroundColor: colors.white, flexGrow: 1, padding: 18, paddingBottom: 28 }, label: { color: '#8b7911', fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 10 }, title: { fontFamily: 'serif', fontSize: 38, fontWeight: '900', marginTop: 7 }, count: { color: colors.muted, marginBottom: 20, marginTop: 4 },
  row: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', paddingVertical: 14 }, art: { alignItems: 'center', borderRadius: 14, height: 72, justifyContent: 'center', width: 72 }, emoji: { fontSize: 32 }, details: { flex: 1, marginHorizontal: 12 }, name: { fontFamily: 'serif', fontSize: 17, fontWeight: '900' }, subtitle: { color: colors.muted, fontSize: 11, marginTop: 2 }, itemPrice: { fontFamily: 'serif', fontSize: 17, fontWeight: '900' },
  stepper: { alignItems: 'center', borderColor: colors.line, borderRadius: 18, borderWidth: 1, flexDirection: 'row', marginTop: 10, overflow: 'hidden', width: 92 }, stepperButton: { alignItems: 'center', height: 28, justifyContent: 'center', width: 29 }, stepperText: { fontSize: 18, fontWeight: '700' }, quantity: { fontSize: 12, fontWeight: '900', minWidth: 28, textAlign: 'center' },
  summary: { backgroundColor: '#f5f4ef', borderRadius: 18, marginTop: 24, padding: 18 }, summaryTitle: { fontFamily: 'serif', fontSize: 19, fontWeight: '900' }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }, bold: { fontWeight: '800' }, total: { borderTopColor: colors.line, borderTopWidth: 1, marginTop: 18, paddingTop: 16 }, totalPrice: { fontFamily: 'serif', fontSize: 22, fontWeight: '900' }, error: { color: '#a52a2a', marginTop: 14 }, checkout: { alignItems: 'center', backgroundColor: colors.black, borderRadius: 24, marginTop: 20, padding: 14 }, checkoutText: { color: colors.white, fontWeight: '900' }, continue: { fontWeight: '800', marginTop: 16, textAlign: 'center' }, clear: { alignItems: 'center', marginTop: 12, padding: 8 }, clearText: { color: '#a13b3b', fontSize: 12, fontWeight: '800', textDecorationLine: 'underline' },
})
