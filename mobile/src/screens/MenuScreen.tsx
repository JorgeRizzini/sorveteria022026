import { useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { ProductCard } from '../components/ProductCard'
import { colors } from '../theme'
import type { Category, Flavor } from '../types'

type Filter = 'Todos' | Category
const filters: Filter[] = ['Todos', 'Clássicos', 'Tropicais', 'Especiais', 'Veganos']

export function MenuScreen({ products, onAdd }: { products: Flavor[]; onAdd: (flavor: Flavor) => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('Todos')
  const visible = useMemo(() => products.filter((item) => (filter === 'Todos' || item.category === filter) && item.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))), [filter, products, query])
  return <FlatList contentContainerStyle={styles.list} data={visible} keyExtractor={(item) => item.id ?? item.name} keyboardShouldPersistTaps="handled" ListHeaderComponent={<><View style={styles.hero}><Text style={styles.label}>{products.length} SABORES ARTESANAIS</Text><Text style={styles.title}>Nosso Cardápio</Text><TextInput onChangeText={setQuery} placeholder="Buscar sabores..." returnKeyType="search" style={styles.search} value={query} /></View><FlatList contentContainerStyle={styles.filters} data={filters} horizontal keyExtractor={(item) => item} renderItem={({ item }) => <Pressable onPress={() => setFilter(item)} style={[styles.filter, item === filter && styles.filterSelected]}><Text style={[styles.filterText, item === filter && styles.filterTextSelected]}>{item}</Text></Pressable>} showsHorizontalScrollIndicator={false} /><Text style={styles.count}>{visible.length} {visible.length === 1 ? 'sabor' : 'sabores'}</Text></>} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyEmoji}>🍨</Text><Text style={styles.emptyTitle}>Nenhum sabor encontrado</Text></View>} renderItem={({ item }) => <ProductCard flavor={item} onAdd={onAdd} />} showsVerticalScrollIndicator={false} />
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.white, flexGrow: 1, paddingBottom: 24 }, hero: { backgroundColor: colors.green, marginHorizontal: -16, paddingHorizontal: 22, paddingVertical: 28 }, label: { color: '#37602c', fontSize: 11, fontWeight: '900', letterSpacing: 1 }, title: { color: colors.black, fontFamily: 'serif', fontSize: 38, fontWeight: '900', marginTop: 8 }, search: { backgroundColor: colors.white, borderRadius: 13, fontSize: 16, marginTop: 20, paddingHorizontal: 15, paddingVertical: 14 }, filters: { gap: 8, paddingVertical: 18 }, filter: { borderColor: colors.line, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 }, filterSelected: { backgroundColor: colors.black }, filterText: { color: colors.muted, fontSize: 12, fontWeight: '800' }, filterTextSelected: { color: colors.yellow }, count: { color: colors.muted, marginBottom: 12 }, empty: { alignItems: 'center', paddingVertical: 80 }, emptyEmoji: { fontSize: 45 }, emptyTitle: { fontFamily: 'serif', fontSize: 22, fontWeight: '900', marginTop: 12 },
})
