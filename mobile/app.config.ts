import { config } from 'dotenv'
import type { ExpoConfig } from 'expo/config'

config({ path: '../.env' })

const expoConfig: ExpoConfig = {
  name: 'ArcadeCream',
  slug: 'arcadecream',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'arcadecream',
  ios: { supportsTablet: true, bundleIdentifier: 'com.arcadecream.app' },
  android: { package: 'com.arcadecream.app' },
  plugins: ['expo-secure-store'],
  extra: { apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3001' },
}

export default expoConfig
