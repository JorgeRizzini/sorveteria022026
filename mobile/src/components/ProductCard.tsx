import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, familyColors } from '../theme'
import type { Flavor } from '../types'

export function ProductCard({ flavor, onAdd }: { flavor: Flavor; onAdd: (flavor: Flavor) => void }) {
  return <View style={styles.card}><View style={[styles.art, { backgroundColor: familyColors[flavor.family] }]}>{flavor.new && <Text style={styles.newTag}>Novo</Text>}<Text style={styles.emoji}>{flavor.emoji}</Text></View><View style={styles.info}><Text style={[styles.badge, { backgroundColor: familyColors[flavor.family] }]}>{flavor.badge}</Text><Text style={styles.name}>{flavor.name}</Text><Text style={styles.subtitle}>{flavor.subtitle}</Text><Text style={styles.description}>{flavor.description}</Text><View style={styles.footer}><Text style={styles.price}>R${flavor.price}</Text><Pressable accessibilityRole="button" onPress={() => onAdd(flavor)} style={[styles.button, { backgroundColor: flavor.family === 'lilac' ? colors.lilac : flavor.family === 'green' ? colors.green : colors.yellow }]}><Text style={styles.buttonText}>Adicionar</Text></Pressable></View></View></View>
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderColor: colors.line, borderRadius: 18, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  art: { alignItems: 'center', height: 145, justifyContent: 'center', position: 'relative' },
  newTag: { backgroundColor: colors.black, borderRadius: 20, color: colors.yellow, fontSize: 11, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 5, position: 'absolute', right: 12, top: 12 },
  emoji: { fontSize: 55 }, info: { padding: 16 }, badge: { alignSelf: 'flex-start', borderRadius: 15, fontSize: 11, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  name: { color: colors.black, fontFamily: 'serif', fontSize: 20, fontWeight: '800', marginTop: 9 },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 }, description: { color: '#55534e', fontSize: 14, lineHeight: 21, marginTop: 10 },
  footer: { alignItems: 'center', borderTopColor: colors.line, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 13 },
  price: { color: colors.black, fontFamily: 'serif', fontSize: 19, fontWeight: '900' }, button: { borderRadius: 24, paddingHorizontal: 18, paddingVertical: 11 }, buttonText: { color: colors.black, fontSize: 12, fontWeight: '800' },
})
