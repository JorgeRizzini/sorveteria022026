import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

export function Brand() {
  return <View style={styles.brand}><View><Text style={styles.arcade}>ARCADE</Text><Text style={styles.cream}>CREAM</Text></View><Text style={styles.icon}>🍦</Text></View>
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', backgroundColor: colors.black, borderRadius: 6, flexDirection: 'row', paddingHorizontal: 9, paddingVertical: 5 },
  arcade: { color: colors.lilac, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  cream: { color: colors.white, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  icon: { fontSize: 14, marginLeft: 4 },
})
