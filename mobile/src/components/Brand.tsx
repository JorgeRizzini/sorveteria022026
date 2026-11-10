import { Image, StyleSheet, View } from 'react-native'

export function Brand() {
  return <View style={styles.brand}><Image accessibilityLabel="Soft Cream" resizeMode="cover" source={require('../../assets/soft-cream-logo.png')} style={styles.logo} /></View>
}

const styles = StyleSheet.create({
  brand: { borderRadius: 8, height: 42, overflow: 'hidden', width: 116 },
  logo: { height: '100%', width: '100%' },
})
