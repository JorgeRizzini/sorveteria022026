import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { api } from '../lib/api'
import { colors } from '../theme'
import type { Order, Profile, User } from '../types'

export function AccountScreen({ user, onLogin, onLogout }: { user: User | null; onLogin: () => void; onLogout: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    if (!user) return
    setLoading(true); setError('')
    try { const [profileResult, orderResult] = await Promise.all([api.profile(), api.orders()]); setProfile(profileResult.profile); setOrders(orderResult.orders) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar sua conta.') }
    finally { setLoading(false) }
  }, [user])
  useEffect(() => { void load() }, [load])

  if (!user) return <View style={styles.guest}><Text style={styles.icon}>👤</Text><Text style={styles.title}>Sua conta Soft Cream</Text><Text style={styles.copy}>Entre para finalizar pedidos e consultar seu histórico.</Text><Pressable onPress={onLogin} style={styles.primary}><Text style={styles.primaryText}>Entrar ou criar conta</Text></Pressable></View>
  return <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}><Text style={styles.label}>MINHA CONTA</Text><Text style={styles.title}>Olá, {profile?.full_name ?? user.email?.split('@')[0]}</Text><Text style={styles.email}>{user.email}</Text><View style={styles.card}><Text style={styles.cardTitle}>Perfil</Text><Text style={styles.field}>Nome: {profile?.full_name ?? 'Não informado'}</Text><Text style={styles.field}>Telefone: {profile?.phone ?? 'Não informado'}</Text></View><Text style={styles.sectionTitle}>Meus pedidos</Text>{loading && !orders.length ? <ActivityIndicator color={colors.black} /> : null}{error ? <Text style={styles.error}>{error}</Text> : null}{!loading && !orders.length ? <Text style={styles.empty}>Você ainda não fez pedidos.</Text> : orders.map((order) => <View key={order.id} style={styles.order}><View style={styles.orderHeader}><Text style={styles.orderCode}>#{order.id.slice(0, 8).toUpperCase()}</Text><Text style={styles.status}>{order.status}</Text></View><Text style={styles.date}>{new Date(order.created_at).toLocaleDateString('pt-BR')}</Text>{order.order_items.map((item) => <Text key={item.id} style={styles.item}>{item.quantity}× {item.product_name}</Text>)}<Text style={styles.total}>Total R${(order.total_cents / 100).toFixed(2).replace('.', ',')}</Text></View>)}<Pressable onPress={onLogout} style={styles.logout}><Text style={styles.logoutText}>Sair da conta</Text></Pressable></ScrollView>
}

const styles = StyleSheet.create({
  guest: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28 }, icon: { fontSize: 52 }, title: { fontFamily: 'serif', fontSize: 28, fontWeight: '900', marginTop: 12, textAlign: 'center' }, copy: { color: colors.muted, lineHeight: 21, marginTop: 8, textAlign: 'center' }, primary: { backgroundColor: colors.yellow, borderRadius: 25, marginTop: 22, paddingHorizontal: 24, paddingVertical: 14 }, primaryText: { fontWeight: '900' }, content: { padding: 20, paddingBottom: 36 }, label: { color: '#8a6dcc', fontSize: 11, fontWeight: '900', letterSpacing: 1 }, email: { color: colors.muted, marginBottom: 18, marginTop: 5 }, card: { backgroundColor: colors.paleGreen, borderRadius: 18, padding: 18 }, cardTitle: { fontFamily: 'serif', fontSize: 20, fontWeight: '900', marginBottom: 8 }, field: { color: '#495a44', marginTop: 5 }, sectionTitle: { fontFamily: 'serif', fontSize: 24, fontWeight: '900', marginBottom: 12, marginTop: 24 }, error: { color: '#a52a2a', marginBottom: 12 }, empty: { color: colors.muted }, order: { borderColor: colors.line, borderRadius: 16, borderWidth: 1, marginBottom: 12, padding: 16 }, orderHeader: { flexDirection: 'row', justifyContent: 'space-between' }, orderCode: { fontWeight: '900' }, status: { backgroundColor: colors.paleYellow, borderRadius: 12, fontSize: 11, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 4 }, date: { color: colors.muted, fontSize: 12, marginBottom: 10, marginTop: 3 }, item: { marginTop: 4 }, total: { borderTopColor: colors.line, borderTopWidth: 1, fontFamily: 'serif', fontSize: 18, fontWeight: '900', marginTop: 12, paddingTop: 10 }, logout: { alignItems: 'center', borderColor: '#a52a2a', borderRadius: 24, borderWidth: 1, marginTop: 16, padding: 13 }, logoutText: { color: '#a52a2a', fontWeight: '900' },
})
