import { useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, familyColors } from '../theme'
import type { Flavor } from '../types'

export function ProductCard({ flavor, onAdd }: { flavor: Flavor; onAdd: (flavor: Flavor, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const scale = useRef(new Animated.Value(1)).current
  const add = () => {
    onAdd(flavor, quantity)
    setAdded(true)
    Animated.sequence([Animated.timing(scale, { toValue: 1.12, duration: 130, useNativeDriver: true }), Animated.spring(scale, { toValue: 1, useNativeDriver: true })]).start()
    setTimeout(() => setAdded(false), 1200)
  }
  const color = flavor.family === 'lilac' ? colors.lilac : flavor.family === 'green' ? colors.green : colors.yellow
  return <View style={styles.card}><View style={[styles.art, { backgroundColor: familyColors[flavor.family] }]}>{flavor.new && <Text style={styles.newTag}>Novo</Text>}<Animated.Text style={[styles.emoji, { transform: [{ scale }] }]}>{flavor.emoji}</Animated.Text></View><View style={styles.info}><Text style={[styles.badge, { backgroundColor: familyColors[flavor.family] }]}>{flavor.badge}</Text><Text style={styles.name}>{flavor.name}</Text><Text style={styles.subtitle}>{flavor.subtitle}</Text><Text style={styles.description}>{flavor.description}</Text><View style={styles.footer}><Text style={styles.price}>R${flavor.price}</Text><View style={styles.controls}><View style={styles.stepper}><Pressable accessibilityLabel="Diminuir quantidade" disabled={quantity === 1} onPress={() => setQuantity((value) => value - 1)} style={styles.stepperButton}><Text style={[styles.stepperText, quantity === 1 && styles.disabled]}>−</Text></Pressable><Text style={styles.quantity}>{quantity}</Text><Pressable accessibilityLabel="Aumentar quantidade" disabled={quantity === 20} onPress={() => setQuantity((value) => value + 1)} style={styles.stepperButton}><Text style={styles.stepperText}>+</Text></Pressable></View><Pressable accessibilityRole="button" onPress={add} style={[styles.button, { backgroundColor: added ? colors.green : color }]}><Text style={styles.buttonText}>{added ? 'Adicionado ✓' : 'Adicionar'}</Text></Pressable></View></View></View></View>
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderColor: colors.line, borderRadius: 18, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  art: { alignItems: 'center', height: 145, justifyContent: 'center', position: 'relative' },
  newTag: { backgroundColor: colors.black, borderRadius: 20, color: colors.yellow, fontSize: 11, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 5, position: 'absolute', right: 12, top: 12 },
  emoji: { fontSize: 55 }, info: { padding: 16 }, badge: { alignSelf: 'flex-start', borderRadius: 15, fontSize: 11, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  name: { color: colors.black, fontFamily: 'serif', fontSize: 20, fontWeight: '800', marginTop: 9 },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 }, description: { color: '#55534e', fontSize: 14, lineHeight: 21, marginTop: 10 },
  footer: { alignItems: 'center', borderTopColor: colors.line, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 13 },
  price: { color: colors.black, fontFamily: 'serif', fontSize: 19, fontWeight: '900' }, controls: { alignItems: 'center', flexDirection: 'row', gap: 8 }, stepper: { alignItems: 'center', borderColor: colors.line, borderRadius: 18, borderWidth: 1, flexDirection: 'row', overflow: 'hidden' }, stepperButton: { alignItems: 'center', height: 34, justifyContent: 'center', width: 28 }, stepperText: { color: colors.black, fontSize: 19, fontWeight: '700' }, disabled: { color: '#c9c6c1' }, quantity: { fontSize: 13, fontWeight: '900', minWidth: 18, textAlign: 'center' }, button: { borderRadius: 24, paddingHorizontal: 14, paddingVertical: 11 }, buttonText: { color: colors.black, fontSize: 12, fontWeight: '800' },
})
