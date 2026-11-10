import { config } from 'dotenv'
import type { ExpoConfig } from 'expo/config'

config({ path: '../.env' })

const expoConfig: ExpoConfig = {
  name: 'Soft Cream',
  slug: 'soft-cream',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'softcream',
  icon: './assets/soft-cream-logo.png',
  ios: { supportsTablet: true, bundleIdentifier: 'com.softcream.app' },
  android: { package: 'com.softcream.app' },
  plugins: ['expo-secure-store'],
  extra: { apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3001' },
}

export default expoConfig
